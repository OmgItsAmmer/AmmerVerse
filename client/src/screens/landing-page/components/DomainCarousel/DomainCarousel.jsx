import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProjectCard from '../ProjectCard';
import { PROJECTS, DEVELOPERS } from '../../data/developerModels.js';
import './DomainCarousel.css';

/* ─── Domain config ──────────────────────────────────────────────────── */
// Order: AI first (default), then Mobile, Web, Desktop
const DOMAIN_ORDER = [3, 0, 1, 2]; // developer ids

const DOMAIN_META = {
    3: { label: 'AI / LLM', color: '#A855F7', glow: 'rgba(168,85,247,0.25)' },
    0: { label: 'Mobile',   color: '#22D3EE', glow: 'rgba(34,211,238,0.20)' },
    1: { label: 'Web',      color: '#34D399', glow: 'rgba(52,211,153,0.20)' },
    2: { label: 'Desktop',  color: '#FBBF24', glow: 'rgba(251,191,36,0.20)' },
};

/* Card positions (absolute % within .carousel-orbit, centered at 50% 48%)  */
const cardSlots = [
    { top: '50%', left: '6%',  transform: 'translateY(-50%) rotate(-3deg)' },
    { top: '50%', left: '72%', transform: 'translateY(-50%) rotate(3deg)'  },
    { top: '8%',  left: '38%', transform: 'translateX(-50%) rotate(-2deg)' },
    { top: '78%', left: '38%', transform: 'translateX(-50%) rotate(2deg)'  },
];

/* ─── AI avatar placeholder ──────────────────────────────────────────── */
function AIAvatarPlaceholder() {
    return (
        <div className="ai-avatar-placeholder" aria-hidden="true">
            <div className="ai-avatar-core">
                <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="ai-avatar-icon">
                    <circle cx="40" cy="40" r="36" stroke="rgba(168,85,247,0.5)" strokeWidth="1.5" strokeDasharray="4 3" />
                    <circle cx="40" cy="40" r="24" fill="rgba(168,85,247,0.12)" />
                    <circle cx="40" cy="40" r="12" fill="rgba(168,85,247,0.25)" />
                    <circle cx="40" cy="40" r="5"  fill="#C084FC" />
                    {/* Neural spokes */}
                    {[0,45,90,135,180,225,270,315].map((deg, i) => {
                        const rad = (deg * Math.PI) / 180;
                        return (
                            <line key={i}
                                x1={40 + 13 * Math.cos(rad)} y1={40 + 13 * Math.sin(rad)}
                                x2={40 + 35 * Math.cos(rad)} y2={40 + 35 * Math.sin(rad)}
                                stroke="rgba(168,85,247,0.4)" strokeWidth="0.8"
                            />
                        );
                    })}
                </svg>
            </div>
            <div className="ai-avatar-ring" />
        </div>
    );
}

/* ─── DomainCarousel ─────────────────────────────────────────────────── */
export default function DomainCarousel({ onProjectClick }) {
    // Active slot in DOMAIN_ORDER (0 = AI)
    const [activeIdx, setActiveIdx] = useState(0);
    const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
    const autoRef = useRef(null);
    const pauseRef = useRef(false);

    const activeDev = DEVELOPERS.find(d => d.id === DOMAIN_ORDER[activeIdx]);
    const domainMeta = DOMAIN_META[DOMAIN_ORDER[activeIdx]];
    const projects = activeDev
        ? activeDev.projectIds.map(id => PROJECTS.find(p => p.id === id)).filter(Boolean)
        : [];

    const goTo = useCallback((newIdx, dir) => {
        setDirection(dir);
        setActiveIdx(newIdx);
        pauseRef.current = true;
        setTimeout(() => { pauseRef.current = false; }, 12000);
    }, []);

    const handleNext = useCallback(() => {
        const next = (activeIdx + 1) % DOMAIN_ORDER.length;
        goTo(next, 1);
    }, [activeIdx, goTo]);

    const handlePrev = useCallback(() => {
        const prev = (activeIdx - 1 + DOMAIN_ORDER.length) % DOMAIN_ORDER.length;
        goTo(prev, -1);
    }, [activeIdx, goTo]);

    // Auto-advance every 7 s
    useEffect(() => {
        autoRef.current = setInterval(() => {
            if (!pauseRef.current) {
                setActiveIdx(prev => (prev + 1) % DOMAIN_ORDER.length);
                setDirection(1);
            }
        }, 7000);
        return () => clearInterval(autoRef.current);
    }, []);

    const domainVariants = {
        enter:  (d) => ({ opacity: 0, x: d > 0 ? 60 : -60, scale: 0.9 }),
        center: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
        exit:   (d) => ({ opacity: 0, x: d > 0 ? -60 : 60, scale: 0.9,
                          transition: { duration: 0.3, ease: [0.55, 0, 1, 0.45] } }),
    };

    return (
        <div className="domain-carousel">
            {/* Section heading */}
            <div className="domain-header">
                <span className="section-eyebrow">My Projects</span>
                <h2 className="domain-section-title">One engineer. Four proof lanes.</h2>
            </div>

            {/* Orbit stage */}
            <div
                className="carousel-orbit"
                style={{ '--domain-glow': domainMeta.glow, '--domain-color': domainMeta.color }}
                onMouseEnter={() => { pauseRef.current = true; }}
                onMouseLeave={() => { setTimeout(() => { pauseRef.current = false; }, 3000); }}
            >
                {/* Center avatar */}
                <div className="carousel-avatar-center">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={DOMAIN_ORDER[activeIdx]}
                            custom={direction}
                            variants={domainVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="carousel-avatar-wrap"
                        >
                            {activeDev?.avatarImages?.normal ? (
                                <img
                                    src={activeDev.avatarImages.normal}
                                    alt={activeDev.name}
                                    className="carousel-avatar-img"
                                    draggable={false}
                                />
                            ) : (
                                <AIAvatarPlaceholder />
                            )}
                            <div className="carousel-avatar-label"
                                style={{ color: domainMeta.color }}>
                                {activeDev?.name}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Orbiting project cards */}
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={`cards-${DOMAIN_ORDER[activeIdx]}`}
                        custom={direction}
                        variants={domainVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
                    >
                        {projects.slice(0, 4).map((project, i) => (
                            <div
                                key={project.id}
                                className="carousel-card-slot"
                                style={{
                                    position: 'absolute',
                                    top: cardSlots[i].top,
                                    left: cardSlots[i].left,
                                    transform: cardSlots[i].transform,
                                    pointerEvents: 'auto',
                                }}
                            >
                                <ProjectCard
                                    project={project}
                                    category={activeDev?.category === 'ai' ? 'ai' : activeDev?.category}
                                    onClick={onProjectClick}
                                    top="50%"
                                    left="50%"
                                    rotate="0deg"
                                />
                            </div>
                        ))}
                        {projects.length === 0 && (
                            <div className="carousel-no-projects">
                                <span>Projects coming soon</span>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Glow ring */}
                <div className="carousel-glow-ring" aria-hidden="true" />
            </div>

            {/* Controls */}
            <div className="carousel-controls">
                <button className="carousel-arrow" onClick={handlePrev} aria-label="Previous domain">‹</button>

                <div className="carousel-tabs">
                    {DOMAIN_ORDER.map((devId, idx) => (
                        <button
                            key={devId}
                            className={`carousel-tab ${idx === activeIdx ? 'active' : ''}`}
                            style={idx === activeIdx ? { '--tab-color': DOMAIN_META[devId].color } : {}}
                            onClick={() => goTo(idx, idx > activeIdx ? 1 : -1)}
                        >
                            {DOMAIN_META[devId].label}
                        </button>
                    ))}
                </div>

                <button className="carousel-arrow" onClick={handleNext} aria-label="Next domain">›</button>
            </div>

            {/* Dot indicators */}
            <div className="carousel-dots">
                {DOMAIN_ORDER.map((_, idx) => (
                    <button
                        key={idx}
                        className={`carousel-dot ${idx === activeIdx ? 'active' : ''}`}
                        style={idx === activeIdx ? { background: domainMeta.color } : {}}
                        onClick={() => goTo(idx, idx > activeIdx ? 1 : -1)}
                        aria-label={`Domain ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
