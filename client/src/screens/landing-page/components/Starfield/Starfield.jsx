import { useEffect, useRef, useState } from 'react';
import { useScrollOutward } from '../../../../hooks/useScrollOutward.js';
import { STARFIELD_STARS } from './starfieldStars.js';
import {
    buildStarRenderList,
    commitIncomingStars,
    createIncomingStars,
    createSettledStars,
} from './starfieldMotion.js';
import './Starfield.css';

function ScopedStarfield() {
    return (
        <div className="starfield starfield--scoped" aria-hidden="true">
            {STARFIELD_STARS.map((star) => (
                <div
                    key={star.id}
                    className="star"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        animationDelay: `${star.delay}s`,
                        opacity: star.opacity,
                        transform: 'translate(-50%, -50%)',
                    }}
                />
            ))}
        </div>
    );
}

function GlobalStarfield() {
    const { push, velocity, prism } = useScrollOutward();
    const settledRef = useRef(createSettledStars(STARFIELD_STARS));
    const incomingRef = useRef(null);
    const lastSlideRef = useRef(0);
    const transitionSeedRef = useRef(0);
    const [, frame] = useState(0);

    useEffect(() => {
        const bump = () => frame((n) => n + 1);
        window.addEventListener('ammerverse:prism-rotate', bump);
        return () => window.removeEventListener('ammerverse:prism-rotate', bump);
    }, []);

    useEffect(() => {
        const slide = prism.slideProgress;
        const { inProjectsSection, direction, activeIndex } = prism;

        if (
            inProjectsSection &&
            slide > 0.035 &&
            lastSlideRef.current <= 0.035 &&
            !incomingRef.current
        ) {
            transitionSeedRef.current = activeIndex * 1000 + direction * 137;
            incomingRef.current = createIncomingStars(
                STARFIELD_STARS.length,
                direction,
                transitionSeedRef.current,
                STARFIELD_STARS
            );
        }

        if (slide < 0.02 && lastSlideRef.current > 0.12 && incomingRef.current) {
            settledRef.current = commitIncomingStars(incomingRef.current);
            incomingRef.current = null;
        }

        if (incomingRef.current && slide < lastSlideRef.current - 0.06 && slide < 0.2) {
            incomingRef.current = null;
        }

        lastSlideRef.current = slide;
        frame((n) => n + 1);
    }, [prism.slideProgress, prism.inProjectsSection, prism.direction, prism.activeIndex]);

    const renderStars = buildStarRenderList({
        settled: settledRef.current,
        incoming: incomingRef.current,
        push,
        velocity,
        prism,
    });

    return (
        <div className="starfield" aria-hidden="true">
            {renderStars.map((star) => {
                if (star.opacity <= 0.01) return null;

                const layerClass =
                    star.layer === 'exit'
                        ? 'star star--exit'
                        : star.layer === 'enter'
                          ? 'star star--enter'
                          : 'star';

                const transform = star.useTransform
                    ? `translate(-50%, -50%) translate(${star.tx}px, ${star.ty}px) scale(${star.scale})`
                    : `translate(-50%, -50%) scale(${star.scale ?? 1})`;

                return (
                    <div
                        key={star.key}
                        className={layerClass}
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            opacity: star.opacity,
                            animationDelay: `${star.delay}s`,
                            transform,
                        }}
                    />
                );
            })}
        </div>
    );
}

export default function Starfield({ variant = 'global' }) {
    if (variant === 'scoped') {
        return <ScopedStarfield />;
    }

    return <GlobalStarfield />;
}
