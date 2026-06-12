import { useState } from 'react';
import { INNER_RING, OUTER_RING, getIconUrl } from '../../data/stackurnLogos.js';
import './StackurnSection.css';

/* ─── Logo item: tries CDN image, falls back to text pill ─────────────── */
function LogoItem({ logo }) {
    const [imgOk, setImgOk] = useState(true);
    const src = getIconUrl(logo.slug, logo.color);

    return (
        <div className="stackurn-logo-item" title={logo.name}>
            {imgOk ? (
                <img
                    src={src}
                    alt={logo.name}
                    className="stackurn-logo-img"
                    onError={() => setImgOk(false)}
                    draggable={false}
                />
            ) : (
                <span className="stackurn-logo-fallback">{logo.fallback}</span>
            )}
            <span className="stackurn-logo-name">{logo.name}</span>
        </div>
    );
}

/* ─── One orbit ring ──────────────────────────────────────────────────── */
function OrbitRing({ logos, radius, duration, reverse = false }) {
    const count = logos.length;

    return (
        <div
            className={`stackurn-orbit-ring ${reverse ? 'reverse' : ''}`}
            style={{
                width: `${radius * 2}px`,
                height: `${radius * 2}px`,
                animationDuration: `${duration}s`,
            }}
        >
            {logos.map((logo, i) => {
                const angle = (360 / count) * i - 90; // start from top
                return (
                    <div
                        key={logo.slug}
                        className="stackurn-logo-orbit-slot"
                        style={{ '--orbit-angle': `${angle}deg`, '--orbit-radius': `${radius}px` }}
                    >
                        {/* Counter-rotate so icons stay upright */}
                        <div
                            className="stackurn-logo-counter"
                            style={{ animation: `stackurn-counter-spin ${duration}s linear infinite ${reverse ? 'reverse' : 'normal'}` }}
                        >
                            <LogoItem logo={logo} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

/* ─── CSS Saturn ──────────────────────────────────────────────────────── */
function SaturnPlanet() {
    return (
        <div className="stackurn-saturn-wrap" aria-hidden="true">
            <div className="stackurn-saturn-rings-back" />
            <div className="stackurn-saturn-body">
                <div className="stackurn-saturn-band" />
                <div className="stackurn-saturn-shine" />
            </div>
            <div className="stackurn-saturn-rings-front" />
        </div>
    );
}

/* ─── StackurnSection ─────────────────────────────────────────────────── */
export default function StackurnSection() {
    return (
        <section id="stackurn" className="stackurn-section">
            <div className="stackurn-inner">
                {/* Header */}
                <div className="stackurn-header">
                    <span className="section-eyebrow">Technology</span>
                    <h2 className="stackurn-title">Stackurn</h2>
                    <p className="stackurn-subtitle">The stacks I ship with.</p>
                </div>

                {/* Planet + orbit system */}
                <div className="stackurn-system">
                    {/* Inner ring — AI / LLMOps */}
                    <OrbitRing logos={INNER_RING} radius={200} duration={30} />

                    {/* Saturn planet (center) */}
                    <div className="stackurn-center">
                        <SaturnPlanet />
                    </div>

                    {/* Outer ring — full-stack / DevOps */}
                    <OrbitRing logos={OUTER_RING} radius={320} duration={48} reverse />
                </div>

                {/* Ring legend */}
                <div className="stackurn-legend">
                    <div className="stackurn-legend-item">
                        <span className="legend-dot inner" />
                        <span>Inner ring — AI · LLMOps</span>
                    </div>
                    <div className="stackurn-legend-item">
                        <span className="legend-dot outer" />
                        <span>Outer ring — Full-stack · DevOps</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
