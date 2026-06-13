import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import EarthModel, { EarthMapFullscreen } from '../EarthModel';
import Starfield from '../Starfield/Starfield.jsx';
import {
    DEPLOYMENTS,
    ECAS,
    FOUNDER_ROLE,
} from '../../data/achievements.js';
import './AchievementsSection.css';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.1 } },
};

function getGlobeSize(viewportHeight, viewportWidth) {
    return Math.round(Math.max(viewportHeight * 1.5, viewportWidth * 1.2));
}

const GLOBE_HIT_RADIUS_RATIO = 0.26;

function getGlobeHitRadius(globeSize) {
    return globeSize * GLOBE_HIT_RADIUS_RATIO;
}

function isInsideGlobeSemicircle(clientX, clientY, globeSize, anchorRect) {
    const cx = anchorRect.right;
    const cy = anchorRect.top + anchorRect.height / 2;
    const radius = getGlobeHitRadius(globeSize);
    if (clientX > cx) return false;
    return Math.hypot(clientX - cx, clientY - cy) <= radius;
}

function FounderBadge() {
    return (
        <div className="founder-badge glass-card">
            <span className="founder-badge-glow" aria-hidden="true" />
            <span className="founder-badge-icon" aria-hidden="true">◆</span>
            <span className="founder-badge-text">
                <span className="founder-badge-role">{FOUNDER_ROLE.role}</span>
                <span className="founder-badge-at">@</span>
                <span className="founder-badge-company">{FOUNDER_ROLE.company}</span>
            </span>
        </div>
    );
}

function DeploymentRow({ name, count }) {
    return (
        <div className="deploy-row glass-card">
            <span className="deploy-row-name">{name}</span>
            <span className="deploy-row-arrow" aria-hidden="true">→</span>
            <span className="deploy-row-count">{count}</span>
            <span className="deploy-row-label">deployed</span>
        </div>
    );
}

function EcaLeadershipCard({ title, event, venue }) {
    return (
        <div className="eca-leadership glass-card">
            <span className="eca-leadership-badge">{title}</span>
            <p className="eca-leadership-text">
                of <strong>{event}</strong> held at <strong>{venue}</strong>
            </p>
        </div>
    );
}

function VentureChip({ name, badge }) {
    return (
        <span className="venture-chip">
            <span className="venture-chip-name">{name}</span>
            {badge && <span className="venture-chip-badge">{badge}</span>}
        </span>
    );
}

function SponsorChip({ name }) {
    return <span className="sponsor-chip">{name}</span>;
}

export default function AchievementsSection() {
    const sectionRef = useRef(null);
    const hitzoneRef = useRef(null);
    const [mapOpen, setMapOpen] = useState(false);
    const [globeLayout, setGlobeLayout] = useState(() => ({
        globeSize: getGlobeSize(window.innerHeight, window.innerWidth),
        top: window.innerHeight / 2,
        visible: true,
    }));

    useEffect(() => {
        const sectionEl = sectionRef.current;
        if (!sectionEl) return;

        const updateLayout = () => {
            const rect = sectionEl.getBoundingClientRect();
            const globeSize = getGlobeSize(window.innerHeight, window.innerWidth);
            const sectionCenter = rect.top + rect.height / 2;
            const inView = rect.bottom > 0 && rect.top < window.innerHeight;

            setGlobeLayout({
                globeSize,
                top: sectionCenter,
                visible: inView,
            });
        };

        updateLayout();
        window.addEventListener('resize', updateLayout);
        window.addEventListener('scroll', updateLayout, { passive: true });

        let lenis = window.__lenis;
        const bindLenis = () => {
            if (lenis || !window.__lenis) return;
            lenis = window.__lenis;
            lenis.on('scroll', updateLayout);
        };
        bindLenis();
        const lenisBindTimer = window.setTimeout(bindLenis, 0);

        const resizeObserver = new ResizeObserver(updateLayout);
        resizeObserver.observe(sectionEl);

        return () => {
            window.clearTimeout(lenisBindTimer);
            window.removeEventListener('resize', updateLayout);
            window.removeEventListener('scroll', updateLayout);
            lenis?.off('scroll', updateLayout);
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <section id="achievements" ref={sectionRef} className="achievements-section">
            <Starfield variant="scoped" />

            <div className="achievements-inner">
                <motion.div
                    className="achievements-left"
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-80px' }}
                >
                    <motion.span className="section-eyebrow" variants={fadeUp}>
                        Achievements
                    </motion.span>

                    <motion.div variants={fadeUp}>
                        <FounderBadge />
                    </motion.div>

                    <motion.div className="achievements-deployments" variants={fadeUp}>
                        <h3 className="clients-heading">Production deployments</h3>
                        <div className="deploy-rows">
                            {DEPLOYMENTS.map((d) => (
                                <DeploymentRow key={d.name} name={d.name} count={d.count} />
                            ))}
                        </div>
                    </motion.div>

                    <motion.div className="achievements-ecas" variants={stagger}>
                        <motion.h3 className="clients-heading" variants={fadeUp}>ECAs</motion.h3>

                        <motion.div variants={fadeUp}>
                            <EcaLeadershipCard {...ECAS.leadership} />
                        </motion.div>

                        <motion.div className="eca-block" variants={fadeUp}>
                            <span className="eca-block-label">Founder of</span>
                            <div className="venture-chips">
                                {ECAS.ventures.map((v) => (
                                    <VentureChip key={v.name} name={v.name} badge={v.badge} />
                                ))}
                            </div>
                        </motion.div>

                        <motion.div className="eca-block" variants={fadeUp}>
                            <span className="eca-block-label">Sponsors</span>
                            <div className="sponsor-chips">
                                {ECAS.sponsors.map((s) => (
                                    <SponsorChip key={s} name={s} />
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>

            <div
                className={`achievements-globe-viewport${globeLayout.visible ? '' : ' achievements-globe-viewport--hidden'}`}
                style={{
                    '--globe-size': `${globeLayout.globeSize}px`,
                    '--globe-top': `${globeLayout.top}px`,
                }}
                aria-hidden="true"
            >
                <EarthModel embedded size={globeLayout.globeSize} />
            </div>

            {globeLayout.visible && !mapOpen && (
                <div
                    ref={hitzoneRef}
                    className="achievements-globe-hitzone"
                    style={{
                        '--globe-size': `${globeLayout.globeSize}px`,
                        '--globe-top': `${globeLayout.top}px`,
                        '--globe-hit-radius': `${getGlobeHitRadius(globeLayout.globeSize)}px`,
                    }}
                    onClick={(e) => {
                        const hzRect = hitzoneRef.current?.getBoundingClientRect();
                        const onDisc = hzRect
                            ? isInsideGlobeSemicircle(e.clientX, e.clientY, globeLayout.globeSize, {
                                  left: hzRect.left,
                                  right: hzRect.right,
                                  top: hzRect.top,
                                  height: hzRect.height,
                              })
                            : false;
                        if (onDisc) setMapOpen(true);
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label="Open interactive map"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setMapOpen(true);
                        }
                    }}
                />
            )}

            {mapOpen && <EarthMapFullscreen onClose={() => setMapOpen(false)} />}
        </section>
    );
}
