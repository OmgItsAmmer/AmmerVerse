import { useEffect } from 'react';
import {
    computeSectionFocus,
    computeSectionTransform,
    computeWheelMultiplier,
} from '../utils/spaceTravel';

/**
 * Drives space-travel depth (scale, blur, parallax) on all [data-space-travel] sections
 * and dynamically slows Lenis wheel input when sections are far from focus.
 */
export function useSpaceTravelScroll() {
    useEffect(() => {
        let rafId = null;
        let smoothedWheel = 0.45;

        const update = () => {
            const sections = document.querySelectorAll('[data-space-travel]');
            const vh = window.innerHeight;

            sections.forEach((outer) => {
                const inner = outer.querySelector('.space-travel-section__inner');
                if (!inner) return;

                const mode = outer.dataset.spaceMode || 'depth';
                const allowBlur = outer.dataset.spaceBlur !== 'false';
                const { focus, dist, absDist } = computeSectionFocus(
                    outer.getBoundingClientRect(),
                    vh,
                );
                const t = computeSectionTransform(
                    { focus, dist, absDist },
                    vh,
                    { blur: allowBlur && mode === 'depth' },
                );

                inner.style.setProperty('--space-opacity', t.opacity.toFixed(4));

                if (mode === 'opacity') {
                    inner.style.removeProperty('--space-scale');
                    inner.style.removeProperty('--space-translate-z');
                    inner.style.removeProperty('--space-parallax-y');
                    inner.style.removeProperty('--space-blur');
                    return;
                }

                inner.style.setProperty('--space-scale', t.scale.toFixed(4));
                inner.style.setProperty('--space-translate-z', `${t.translateZ.toFixed(1)}px`);
                inner.style.setProperty('--space-parallax-y', `${t.parallaxY.toFixed(1)}px`);
                inner.style.setProperty('--space-blur', `${t.blurPx.toFixed(2)}px`);
            });

            const lenis = window.__lenis;
            if (lenis) {
                const target = computeWheelMultiplier(sections, vh);
                smoothedWheel += (target - smoothedWheel) * 0.07;
                lenis.options.wheelMultiplier = smoothedWheel;
                lenis.options.touchMultiplier = 0.65 + smoothedWheel * 0.35;
            }
        };

        const schedule = () => {
            if (rafId !== null) return;
            rafId = requestAnimationFrame(() => {
                rafId = null;
                update();
            });
        };

        const bindLenis = () => {
            const lenis = window.__lenis;
            if (!lenis) return null;
            lenis.on('scroll', schedule);
            schedule();
            return lenis;
        };

        let lenis = bindLenis();
        const lenisTimer = window.setTimeout(bindLenis, 0);

        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        schedule();

        return () => {
            window.clearTimeout(lenisTimer);
            if (rafId !== null) cancelAnimationFrame(rafId);
            lenis?.off('scroll', schedule);
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
        };
    }, []);
}
