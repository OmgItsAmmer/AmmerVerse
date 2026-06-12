function seededRandom(seed) {
    const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
    return x - Math.floor(x);
}

export function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

export function easeInCubic(t) {
    return t * t * t;
}

/** Initial settled star field */
export function createSettledStars(starDefs) {
    return starDefs.map((star) => ({
        id: star.id,
        x: star.x,
        y: star.y,
        opacity: star.opacity,
        size: star.size,
        delay: star.delay,
    }));
}

/** Spawn incoming batch from the carousel entry edge */
export function createIncomingStars(count, direction, seedBase, starDefs) {
    const enterFromRight = direction > 0;

    return starDefs.slice(0, count).map((star, i) => {
        const seed = seedBase + i * 17 + star.id * 31;
        const spawnX = enterFromRight
            ? 112 + seededRandom(seed) * 16
            : -18 - seededRandom(seed) * 16;
        const spawnY = 8 + seededRandom(seed * 1.9) * 84;
        const targetX = 6 + seededRandom(seed * 2.7) * 88;
        const targetY = 10 + seededRandom(seed * 3.3) * 80;

        return {
            id: `in-${seedBase}-${star.id}`,
            spawnX,
            spawnY,
            targetX,
            targetY,
            opacity: star.opacity,
            size: star.size,
            delay: star.delay,
        };
    });
}

export function commitIncomingStars(incoming) {
    return incoming.map((star) => ({
        id: star.id.replace(/^in-\d+-/, 's-'),
        x: star.targetX,
        y: star.targetY,
        opacity: star.opacity,
        size: star.size,
        delay: star.delay,
    }));
}

export function getOutwardDrive(push, velocity, prismPush) {
    return Math.min(1.65, push * 1.1 + velocity * 0.55 + prismPush * 0.75);
}

/** Radial scroll exit — stars fully leave viewport at drive ~1 */
export function getRadialStarMotion(star, push, velocity, intensity = 1) {
    const drive = getOutwardDrive(push, velocity, 0);
    const cx = 50;
    const cy = 50;
    const dx = star.x - cx;
    const dy = star.y - cy;
    const dist = Math.hypot(dx, dy) || 1;
    const distWeight = 0.65 + (dist / 60) * 1.1;
    const pushPx = drive * 320 * distWeight * intensity;

    return {
        tx: (dx / dist) * pushPx,
        ty: (dy / dist) * pushPx,
        scale: 1 + drive * 0.35 * intensity,
        opacity: star.opacity * Math.max(0, 1 - drive * 1.05),
    };
}

/**
 * Build render list for current frame.
 * In projects + sliding: outgoing stars exit off-screen; incoming stars enter from edge.
 */
export function buildStarRenderList({ settled, incoming, push, velocity, prism }) {
    const {
        inProjectsSection = false,
        slideProgress = 0,
        direction = 1,
    } = prism ?? {};

    const stars = [];

    if (inProjectsSection && slideProgress > 0.015 && settled.length) {
        const exitT = easeInCubic(Math.min(1, slideProgress * 1.15));
        const enterT = easeOutCubic(Math.min(1, slideProgress * 1.05));
        const exitShift = direction * exitT * 155;

        for (const star of settled) {
            const yDrift = (star.y - 50) * exitT * 0.22;
            stars.push({
                key: `exit-${star.id}`,
                layer: 'exit',
                x: star.x - exitShift,
                y: star.y + yDrift,
                opacity: star.opacity * Math.max(0, 1 - exitT * 1.25),
                size: star.size,
                delay: star.delay,
                scale: 1 + exitT * 0.35,
            });
        }

        if (incoming?.length) {
            for (const star of incoming) {
                stars.push({
                    key: star.id,
                    layer: 'enter',
                    x: star.spawnX + (star.targetX - star.spawnX) * enterT,
                    y: star.spawnY + (star.targetY - star.spawnY) * enterT,
                    opacity: star.opacity * enterT,
                    size: star.size,
                    delay: star.delay,
                    scale: 0.65 + enterT * 0.35,
                });
            }
        }

        return stars;
    }

    for (const star of settled) {
        const { tx, ty, scale, opacity } = getRadialStarMotion(star, push, velocity, 1);

        stars.push({
            key: `settled-${star.id}`,
            layer: 'settled',
            x: star.x,
            y: star.y,
            tx,
            ty,
            opacity,
            size: star.size,
            delay: star.delay,
            scale,
            useTransform: true,
        });
    }

    return stars;
}
