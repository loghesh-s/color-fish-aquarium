export const SPECIES = [
  { id: "goldfish",   name: "Goldfish",          type: "Coldwater", colors: ["#ff8c1a", "#ffcf70"], temp: "18–22°C", care: "Easy",
    desc: "Classic, hardy and long-lived. Needs plenty of space and strong filtration." },
  { id: "neon-tetra", name: "Neon Tetra",        type: "Tropical",  colors: ["#1fa2ff", "#ff3d5a"], temp: "22–26°C", care: "Easy",
    desc: "Peaceful schooling fish with a glowing blue stripe. Keep in groups of 6+." },
  { id: "betta",      name: "Betta",             type: "Tropical",  colors: ["#7b2ff7", "#ff2e93"], temp: "24–28°C", care: "Easy",
    desc: "Flowing fins and bold colors. Males must be kept alone." },
  { id: "guppy",      name: "Guppy",             type: "Tropical",  colors: ["#ffd23f", "#ff6f59"], temp: "22–28°C", care: "Easy",
    desc: "Colorful, active livebearers. Great for beginners." },
  { id: "molly",      name: "Sailfin Molly",     type: "Tropical",  colors: ["#f5f5f5", "#ffb703"], temp: "24–28°C", care: "Easy",
    desc: "Hardy livebearer with a tall, sail-like dorsal fin." },
  { id: "discus",     name: "Discus",            type: "Tropical",  colors: ["#ff595e", "#1982c4"], temp: "28–31°C", care: "Hard",
    desc: "Stunning disc-shaped cichlid. Needs very clean, warm, soft water." },
  { id: "clownfish",  name: "Clownfish",         type: "Marine",    colors: ["#ff7f11", "#ffffff"], temp: "24–27°C", care: "Moderate",
    desc: "Bright orange reef fish known for living among sea anemones." },
  { id: "blue-tang",  name: "Blue Tang",         type: "Marine",    colors: ["#1d4ed8", "#facc15"], temp: "24–26°C", care: "Hard",
    desc: "Vivid blue surgeonfish that needs a large, mature reef tank." },
  { id: "mandarin",   name: "Mandarin Dragonet", type: "Marine",    colors: ["#00b4d8", "#ff9e00"], temp: "24–27°C", care: "Hard",
    desc: "Psychedelic patterns. Feeds mainly on live copepods." },
];

export const TYPES = ["All", ...new Set(SPECIES.map((s) => s.type))];