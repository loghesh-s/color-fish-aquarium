const rand = (min, max) => Math.random() * (max - min) + min;
const MAX_FISH = 40;
const MAX_FOOD = 30;

class Fish {
  constructor(species, w, h) {
    this.species = species;
    this.size = rand(12, 22);
    this.x = rand(this.size * 2, Math.max(this.size * 2, w - this.size * 2));
    this.y = rand(40, Math.max(40, h - 90));
    this.vx = (Math.random() < 0.5 ? -1 : 1) * rand(0.6, 1.6);
    this.vy = 0;
    this.facing = Math.sign(this.vx);
    this.phase = rand(0, Math.PI * 2);
  }

  #nearestFood(foods) {
    let best = null, bestDist = 300; // only notice food within 300px
    for (const f of foods) {
      if (f.eaten) continue;
      const d = Math.hypot(f.x - this.x, f.y - this.y);
      if (d < bestDist) { bestDist = d; best = f; }
    }
    return best;
  }

  update(dt, w, h, foods) {
    this.phase += 0.18 * dt;
    const food = this.#nearestFood(foods);

    if (food) {
      // steer toward food
      const dx = food.x - this.x, dy = food.y - this.y;
      const d = Math.hypot(dx, dy) || 1;
      this.vx += ((dx / d) * 2.4 - this.vx) * 0.06 * dt;
      this.vy += ((dy / d) * 2.4 - this.vy) * 0.06 * dt;
      if (d < this.size) food.eaten = true;
    } else {
      // relaxed cruising with gentle up/down drift
      if (Math.abs(this.vx) < 0.6) this.vx += this.facing * 0.05 * dt;
      if (Math.abs(this.vx) > 1.8) this.vx *= 0.98;
      this.vy += (Math.sin(this.phase * 0.15) * 0.4 - this.vy) * 0.03 * dt;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if (Math.abs(this.vx) > 0.15) this.facing = Math.sign(this.vx);

    // bounce off tank walls
    const m = this.size * 1.6, top = 20, bottom = h - 50;
    if (this.x < m)     { this.x = m;     this.vx =  Math.abs(this.vx); }
    if (this.x > w - m) { this.x = w - m; this.vx = -Math.abs(this.vx); }
    if (this.y < top)    { this.y = top;    this.vy =  Math.abs(this.vy); }
    if (this.y > bottom) { this.y = bottom; this.vy = -Math.abs(this.vy); }
  }

  draw(ctx) {
    const s = this.size;
    const [body, fin] = this.species.colors;
    const wag = Math.sin(this.phase) * s * 0.25;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.facing, 1);

    // tail
    ctx.fillStyle = fin;
    ctx.beginPath();
    ctx.moveTo(-s * 0.8, 0);
    ctx.lineTo(-s * 1.6, -s * 0.6 + wag);
    ctx.lineTo(-s * 1.6,  s * 0.6 + wag);
    ctx.closePath();
    ctx.fill();

    // dorsal fin
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.moveTo(-s * 0.3, -s * 0.45);
    ctx.quadraticCurveTo(0, -s * 1.05, s * 0.35, -s * 0.45);
    ctx.fill();
    ctx.globalAlpha = 1;

    // body
    const g = ctx.createLinearGradient(-s, 0, s, 0);
    g.addColorStop(0, fin);
    g.addColorStop(0.5, body);
    g.addColorStop(1, body);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, 0, s, s * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();

    // eye
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(s * 0.55, -s * 0.12, s * 0.15, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#111";
    ctx.beginPath(); ctx.arc(s * 0.6, -s * 0.12, s * 0.07, 0, Math.PI * 2); ctx.fill();

    ctx.restore();
  }
}

class Bubble {
  constructor(w, h, y = h) { this.reset(w, h, y); }
  reset(w, h, y = h) {
    this.x = rand(0, w); this.y = y;
    this.r = rand(1.5, 5); this.speed = rand(0.4, 1.2);
    this.phase = rand(0, Math.PI * 2);
  }
  update(dt, w, h) {
    this.y -= this.speed * dt;
    this.phase += 0.05 * dt;
    if (this.y < -10) this.reset(w, h);
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x + Math.sin(this.phase) * 3, this.y, this.r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,.6)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

class Food {
  constructor(x, y) { this.x = x; this.y = y; this.eaten = false; this.life = 600; } // ~10s on the floor
  update(dt, h) {
    if (this.y < h - 45) this.y += 0.6 * dt;
    else this.life -= dt;
  }
  get gone() { return this.eaten || this.life <= 0; }
  draw(ctx) {
    ctx.fillStyle = "#c97b2c";
    ctx.beginPath(); ctx.arc(this.x, this.y, 3, 0, Math.PI * 2); ctx.fill();
  }
}

function makePlants(w, h) {
  const n = Math.max(4, Math.floor(w / 90));
  const colors = ["#2d9f5a", "#1f7a44", "#5cc06c"];
  return Array.from({ length: n }, (_, i) => ({
    x: (i + 0.5) * (w / n) + rand(-20, 20),
    height: rand(h * 0.25, h * 0.5),
    color: colors[i % colors.length],
    phase: rand(0, Math.PI * 2),
  }));
}

function drawScene(ctx, w, h, plants, t) {
  // light rays
  ctx.fillStyle = "rgba(255,255,255,.05)";
  for (let i = 0; i < 4; i++) {
    const x = (w / 4) * i + Math.sin(t * 0.0003 + i) * 40;
    ctx.beginPath();
    ctx.moveTo(x, 0); ctx.lineTo(x + 60, 0);
    ctx.lineTo(x + 160, h); ctx.lineTo(x + 40, h);
    ctx.fill();
  }

  // swaying seaweed
  ctx.lineCap = "round";
  ctx.lineWidth = 6;
  for (const p of plants) {
    const sway = Math.sin(t * 0.001 + p.phase) * 18;
    ctx.strokeStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(p.x, h - 20);
    ctx.quadraticCurveTo(p.x + sway, h - 20 - p.height / 2, p.x + sway * 1.5, h - 20 - p.height);
    ctx.stroke();
  }

  // wavy sand
  const g = ctx.createLinearGradient(0, h - 40, 0, h);
  g.addColorStop(0, "#e9c98b");
  g.addColorStop(1, "#c9a25e");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, h - 30);
  for (let x = 0; x <= w; x += 40) ctx.quadraticCurveTo(x + 20, h - 40, x + 40, h - 30);
  ctx.lineTo(w, h); ctx.lineTo(0, h);
  ctx.fill();
}

export function createTank(canvas, { onCountChange = () => {} } = {}) {
  const ctx = canvas.getContext("2d");
  let w = 0, h = 0, last = performance.now();
  let plants = [], fishes = [], foods = [], bubbles = [];

  // crisp rendering on high-DPI screens + responsive size
  const resize = () => {
    const dpr = window.devicePixelRatio || 1;
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    plants = makePlants(w, h);
    if (!bubbles.length) bubbles = Array.from({ length: 25 }, () => new Bubble(w, h, rand(0, h)));
  };
  new ResizeObserver(resize).observe(canvas);
  resize();

  function feed(x, y, n = 5) {
    for (let i = 0; i < n && foods.length < MAX_FOOD; i++) {
      foods.push(new Food(x + rand(-15, 15), y + rand(-8, 8)));
    }
  }

  canvas.addEventListener("pointerdown", (e) => {
    const r = canvas.getBoundingClientRect();
    feed(e.clientX - r.left, e.clientY - r.top);
  });

  function loop(now) {
    const dt = Math.min((now - last) / 16.67, 3); // frame-rate independent movement
    last = now;
    ctx.clearRect(0, 0, w, h);
    drawScene(ctx, w, h, plants, now);
    foods = foods.filter((f) => !f.gone);
    foods.forEach((f) => { f.update(dt, h); f.draw(ctx); });
    fishes.forEach((f) => { f.update(dt, w, h, foods); f.draw(ctx); });
    bubbles.forEach((b) => { b.update(dt, w, h); b.draw(ctx); });
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  return {
    addFish(species) {
      if (fishes.length >= MAX_FISH) return false;
      fishes.push(new Fish(species, w, h));
      onCountChange(fishes.length);
      return true;
    },
    feed,
    feedRandom() {
      for (let i = 0; i < 3; i++) feed(rand(40, w - 40), rand(20, 60));
    },
    clear() {
      fishes = []; foods = [];
      onCountChange(0);
    },
  };
}