import { useEffect, useRef, useState } from 'react';

const initialPrism = {
    rotation: 0,
    activeIndex: 0,
    sideCount: 4,
    isDragging: false,
    slideProgress: 0,
    direction: 1,
    angleStep: 90,
    inProjectsSection: false,
};

const initialState = {
    push: 0,
    velocity: 0,
    prismPush: 0,
    prism: initialPrism,
};

/**
 * Scroll + prism carousel drivers for ambient layers.
 */
export function useScrollOutward() {
    const [state, setState] = useState(initialState);
    const directionRef = useRef(1);

    useEffect(() => {
        const measure = (scrollY = window.scrollY, velocity = 0) => {
            const vh = window.innerHeight;
            const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
            const globalPush = Math.min(1, scrollY / maxScroll);

            const projects = document.getElementById('my-projects');
            let sectionPush = 0;
            let inProjectsSection = false;

            if (projects) {
                const rect = projects.getBoundingClientRect();
                sectionPush = Math.min(1, Math.max(0, 1 - rect.top / vh));
                inProjectsSection = rect.top < vh * 0.88 && rect.bottom > vh * 0.12;
            }

            const push = Math.min(1, globalPush * 0.6 + sectionPush * 0.75);
            const velNorm = Math.min(1, Math.abs(velocity) / 12);

            setState((prev) => ({
                ...prev,
                push,
                velocity: velNorm,
                prism: { ...prev.prism, inProjectsSection },
            }));
        };

        const onPrismRotate = (event) => {
            const {
                rotation = 0,
                sideCount = 4,
                activeIndex = 0,
                isDragging = false,
            } = event.detail ?? {};

            const angleStep = 360 / sideCount;
            const snapped = Math.round(rotation / angleStep) * angleStep;
            let delta = rotation - snapped;

            while (delta > angleStep / 2) delta -= angleStep;
            while (delta < -angleStep / 2) delta += angleStep;

            if (delta !== 0) {
                directionRef.current = delta > 0 ? 1 : -1;
            }

            const slideProgress = Math.min(1, Math.abs(delta) / (angleStep * 0.46));

            const projects = document.getElementById('my-projects');
            let inProjectsSection = false;
            if (projects) {
                const rect = projects.getBoundingClientRect();
                inProjectsSection = rect.top < window.innerHeight * 0.88 && rect.bottom > window.innerHeight * 0.12;
            }

            setState((prev) => ({
                ...prev,
                prismPush: slideProgress,
                prism: {
                    rotation,
                    activeIndex,
                    sideCount,
                    isDragging,
                    slideProgress,
                    direction: directionRef.current,
                    angleStep,
                    inProjectsSection,
                },
            }));
        };

        const lenis = window.__lenis;
        if (lenis) {
            const onScroll = ({ scroll, velocity }) => measure(scroll, velocity);
            lenis.on('scroll', onScroll);
            measure(lenis.scroll, 0);
            window.addEventListener('ammerverse:prism-rotate', onPrismRotate);
            return () => {
                lenis.off('scroll', onScroll);
                window.removeEventListener('ammerverse:prism-rotate', onPrismRotate);
            };
        }

        const onScroll = () => measure();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('ammerverse:prism-rotate', onPrismRotate);
        measure();
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('ammerverse:prism-rotate', onPrismRotate);
        };
    }, []);

    return state;
}

export { getOutwardDrive, getRadialStarMotion } from '../screens/landing-page/components/Starfield/starfieldMotion.js';
