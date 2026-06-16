/** Smoothstep easing for cinematic focus transitions */
export function smoothstep(t) {
    const x = Math.max(0, Math.min(1, t));
    return x * x * (3 - 2 * x);
}

/**
 * Focus factor for a section (1 = centered in viewport, 0 = far away).
 */
export function computeSectionFocus(rect, viewportHeight) {
    const viewCenter = viewportHeight * 0.5;
    const sectionCenter = rect.top + rect.height * 0.5;
    const dist = (sectionCenter - viewCenter) / viewportHeight;
    const absDist = Math.min(1.45, Math.abs(dist));
    return {
        focus: Math.max(0, 1 - absDist / 1.08),
        dist,
        absDist,
    };
}

/**
 * Scroll-linked depth transforms for a section panel.
 */
export function computeSectionTransform({ focus, dist, absDist }, viewportHeight, { blur = true } = {}) {
    const eased = smoothstep(focus);

    const scale = 0.7 + eased * 0.3;
    const opacity = 0.38 + eased * 0.62;
    const translateZ = (1 - eased) * -280;
    const parallaxY = dist * viewportHeight * 0.16;
    const depthLag = dist * viewportHeight * 0.1 * (1 - eased);
    const blurPx = blur ? Math.pow(1 - eased, 1.45) * 12 : 0;

    return {
        scale,
        opacity,
        translateZ,
        parallaxY: parallaxY + depthLag,
        blurPx,
    };
}

/**
 * Slow wheel input when no section is in the focal zone (traveling through void).
 */
export function computeWheelMultiplier(sectionElements, viewportHeight) {
    if (!sectionElements.length) return 0.48;

    let bestFocus = 0;
    let minAbsDist = Infinity;

    sectionElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const { focus, absDist } = computeSectionFocus(rect, viewportHeight);
        bestFocus = Math.max(bestFocus, focus);
        minAbsDist = Math.min(minAbsDist, absDist);
    });

    if (bestFocus > 0.72) return 0.62 + bestFocus * 0.22;
    if (minAbsDist > 1.05) return 0.28 + (1.45 - minAbsDist) * 0.12;
    if (minAbsDist > 0.55) return 0.38 + (1.05 - minAbsDist) * 0.35;
    return 0.52 + bestFocus * 0.28;
}

/**
 * Navbar scroll duration — longer jumps feel like crossing space.
 */
export function computeScrollDuration(currentScroll, targetScroll, viewportHeight) {
    const sectionsAway = Math.abs(targetScroll - currentScroll) / Math.max(viewportHeight, 1);
    return Math.min(4.8, 1.35 + sectionsAway * 1.05);
}
