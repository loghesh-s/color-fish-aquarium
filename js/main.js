import { SPECIES } from "./data.js";
import { createTank } from "./tank.js";
import { initGallery } from "./gallery.js";
import { initNav, initReveal, toast } from "./ui.js";

const $ = (id) => document.getElementById(id);
const countEl = $("fishCount");

const tank = createTank($("tankCanvas"), {
  onCountChange: (n) => (countEl.textContent = `${n} fish`),
});

const randomSpecies = () => SPECIES[Math.floor(Math.random() * SPECIES.length)];

const addFish = (species) =>
  toast(tank.addFish(species) ? `${species.name} added to the tank 🐟` : "Tank is full! Clear some space.");

// start with a few fish
for (let i = 0; i < 8; i++) tank.addFish(randomSpecies());

$("feedBtn").addEventListener("click", () => tank.feedRandom());
$("addRandomBtn").addEventListener("click", () => addFish(randomSpecies()));
$("clearBtn").addEventListener("click", () => { tank.clear(); toast("Tank cleared"); });

initGallery({ filtersEl: $("filters"), galleryEl: $("gallery"), onAdd: addFish });
initNav();
initReveal();