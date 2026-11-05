import { SPECIES, TYPES } from "./data.js";

export function fishSVG([body, fin]) {
  return `
    <svg viewBox="0 0 120 70" aria-hidden="true">
      <path d="M22 35 L4 16 L8 35 L4 54 Z" fill="${fin}"/>
      <path d="M50 14 Q62 2 74 14 Z" fill="${fin}" opacity=".85"/>
      <ellipse cx="60" cy="35" rx="40" ry="22" fill="${body}"/>
      <path d="M60 13 Q52 35 60 57" stroke="${fin}" stroke-width="5" fill="none" opacity=".7"/>
      <circle cx="86" cy="30" r="5" fill="#fff"/>
      <circle cx="87.5" cy="30" r="2.5" fill="#111"/>
    </svg>`;
}

const cardHTML = (s) => `
  <article class="card">
    <div class="card__art">${fishSVG(s.colors)}</div>
    <div class="card__head">
      <h3 class="card__name">${s.name}</h3>
      <span class="tag">${s.type}</span>
    </div>
    <p class="card__desc">${s.desc}</p>
    <div class="card__meta"><span>🌡️ ${s.temp}</span><span>⭐ ${s.care}</span></div>
    <button class="btn btn--sm" data-add="${s.id}">Add to tank</button>
  </article>`;

export function initGallery({ filtersEl, galleryEl, onAdd }) {
  let active = "All";

  filtersEl.innerHTML = TYPES.map((t) =>
    `<button class="filter${t === active ? " is-active" : ""}" data-type="${t}" aria-pressed="${t === active}">${t}</button>`
  ).join("");

  const render = () => {
    const list = active === "All" ? SPECIES : SPECIES.filter((s) => s.type === active);
    galleryEl.innerHTML = list.map(cardHTML).join("");
  };

  // event delegation: one listener per container, works for re-rendered cards
  filtersEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-type]");
    if (!btn) return;
    active = btn.dataset.type;
    filtersEl.querySelectorAll(".filter").forEach((f) => {
      const on = f === btn;
      f.classList.toggle("is-active", on);
      f.setAttribute("aria-pressed", on);
    });
    render();
  });

  galleryEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (btn) onAdd(SPECIES.find((s) => s.id === btn.dataset.add));
  });

  render();
}