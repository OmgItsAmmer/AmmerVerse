function seededRandom(seed) {
    const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
    return x - Math.floor(x);
}

/** Stable star positions shared by base + parallax layers */
export const STARFIELD_STARS = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    x: seededRandom(i * 1.713) * 100,
    y: seededRandom(i * 2.419) * 100,
    opacity: seededRandom(i * 3.117) * 0.55 + 0.25,
    delay: seededRandom(i * 4.231) * 3,
    size: seededRandom(i * 5.877) > 0.82 ? 3 : 2,
}));
