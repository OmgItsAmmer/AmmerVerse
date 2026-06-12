import { useState, useCallback } from 'react';
import HexagonSlider from '../HexagonSlider/HexagonSlider';
import ProjectCard from '../ProjectCard';
import { PROJECTS, DEVELOPERS } from '../../data/developerModels.js';
import { useIsMobile } from '../../../../hooks/useMediaQuery';
import './DomainCarousel.css';

/* ─── Domain config ──────────────────────────────────────────────────── */
const DOMAIN_ORDER = [3, 0, 1, 2];

const DOMAIN_META = {
    3: { label: 'AI / LLM', color: '#A855F7', glow: 'rgba(168,85,247,0.25)' },
    0: { label: 'Mobile', color: '#22D3EE', glow: 'rgba(34,211,238,0.20)' },
    1: { label: 'Web', color: '#34D399', glow: 'rgba(52,211,153,0.20)' },
    2: { label: 'Desktop', color: '#FBBF24', glow: 'rgba(251,191,36,0.20)' },
};

/* Project slots on each face — circular orbit around center avatar (Y-axis ring) */
function getOrbitSlot(index, total, radiusPercent = 36) {
    if (total === 0) return {};
    const angleDeg = (index / total) * 360 - 90;
    const rad = (angleDeg * Math.PI) / 180;
    return {
        left: `${50 + radiusPercent * Math.cos(rad)}%`,
        top: `${50 + radiusPercent * Math.sin(rad)}%`,
        transform: `translate(-50%, -50%) rotate(${angleDeg + 90}deg)`,
    };
}

function AIAvatarPlaceholder() {
    return (
        <div className="ai-avatar-placeholder" aria-hidden="true">
            <div className="ai-avatar-core">
                <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="ai-avatar-icon">
                    <circle cx="40" cy="40" r="36" stroke="rgba(168,85,247,0.5)" strokeWidth="1.5" strokeDasharray="4 3" />
                    <circle cx="40" cy="40" r="24" fill="rgba(168,85,247,0.12)" />
                    <circle cx="40" cy="40" r="12" fill="rgba(168,85,247,0.25)" />
                    <circle cx="40" cy="40" r="5" fill="#C084FC" />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
                        const rad = (deg * Math.PI) / 180;
                        return (
                            <line
                                key={i}
                                x1={40 + 13 * Math.cos(rad)}
                                y1={40 + 13 * Math.sin(rad)}
                                x2={40 + 35 * Math.cos(rad)}
                                y2={40 + 35 * Math.sin(rad)}
                                stroke="rgba(168,85,247,0.4)"
                                strokeWidth="0.8"
                            />
                        );
                    })}
                </svg>
            </div>
            <div className="ai-avatar-ring" />
        </div>
    );
}

function DomainFace({ developer, domainMeta, onProjectClick, isActive }) {
    const projects = developer
        ? developer.projectIds.map((id) => PROJECTS.find((p) => p.id === id)).filter(Boolean)
        : [];
    const visibleProjects = projects.slice(0, 4);
    const avatarSrc = isActive
        ? developer?.avatarImages?.hover || developer?.avatarImages?.normal
        : developer?.avatarImages?.normal || developer?.avatarImages?.hover;

    return (
        <div
            className="domain-face"
            style={{
                '--domain-glow': domainMeta.glow,
                '--domain-color': domainMeta.color,
            }}
        >
            <div className="domain-face__glow" aria-hidden="true" />

            <div className="domain-face__avatar">
                {avatarSrc ? (
                    <img
                        src={avatarSrc}
                        alt={developer?.name ?? 'Developer avatar'}
                        className="domain-face__avatar-img"
                        draggable={false}
                    />
                ) : (
                    <AIAvatarPlaceholder />
                )}
                <span className="domain-face__avatar-label" style={{ color: domainMeta.color }}>
                    {developer?.name}
                </span>
            </div>

            <div className="domain-face__orbit">
                {visibleProjects.map((project, i) => (
                    <div
                        key={project.id}
                        className="domain-face__project-slot"
                        style={getOrbitSlot(i, visibleProjects.length)}
                    >
                        <ProjectCard
                            project={project}
                            category={developer?.category === 'ai' ? 'ai' : developer?.category}
                            onClick={onProjectClick}
                            top="50%"
                            left="50%"
                            rotate="0deg"
                        />
                    </div>
                ))}
                {visibleProjects.length === 0 && (
                    <div className="domain-face__empty">
                        <span>Projects coming soon</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function DomainCarousel({ onProjectClick }) {
    const [activeIdx, setActiveIdx] = useState(0);
    const isMobile = useIsMobile();

    const activeDevId = DOMAIN_ORDER[activeIdx];
    const domainMeta = DOMAIN_META[activeDevId];
    const faceWidth = isMobile ? 340 : 520;
    const faceHeight = isMobile ? 360 : 480;

    const handlePrev = useCallback(() => {
        setActiveIdx((prev) => (prev - 1 + DOMAIN_ORDER.length) % DOMAIN_ORDER.length);
    }, []);

    const handleNext = useCallback(() => {
        setActiveIdx((prev) => (prev + 1) % DOMAIN_ORDER.length);
    }, []);

    const goTo = useCallback((idx) => {
        setActiveIdx(idx);
    }, []);

    return (
        <div className="domain-carousel">
            <div className="domain-header">
                <span className="section-eyebrow">My Projects</span>
                <h2 className="domain-section-title">One engineer. Four proof lanes.</h2>
                <p className="domain-section-hint">Drag the carousel or use arrows to rotate domains</p>
            </div>

            <div className="carousel-stage">
                <HexagonSlider
                    sideCount={DOMAIN_ORDER.length}
                    activeIndex={activeIdx}
                    onActiveChange={setActiveIdx}
                    autoAdvanceMs={8000}
                    faceWidth={faceWidth}
                    faceHeight={faceHeight}
                >
                    {DOMAIN_ORDER.map((devId, idx) => {
                        const developer = DEVELOPERS.find((d) => d.id === devId);
                        return (
                            <DomainFace
                                key={devId}
                                developer={developer}
                                domainMeta={DOMAIN_META[devId]}
                                onProjectClick={onProjectClick}
                                isActive={idx === activeIdx}
                            />
                        );
                    })}
                </HexagonSlider>
            </div>

            <div className="carousel-controls">
                <button type="button" className="carousel-arrow" onClick={handlePrev} aria-label="Previous domain">
                    ‹
                </button>

                <div className="carousel-tabs">
                    {DOMAIN_ORDER.map((devId, idx) => (
                        <button
                            key={devId}
                            type="button"
                            className={`carousel-tab ${idx === activeIdx ? 'active' : ''}`}
                            style={idx === activeIdx ? { '--tab-color': DOMAIN_META[devId].color } : {}}
                            onClick={() => goTo(idx)}
                        >
                            {DOMAIN_META[devId].label}
                        </button>
                    ))}
                </div>

                <button type="button" className="carousel-arrow" onClick={handleNext} aria-label="Next domain">
                    ›
                </button>
            </div>

            <div className="carousel-dots">
                {DOMAIN_ORDER.map((devId, idx) => (
                    <button
                        key={idx}
                        type="button"
                        className={`carousel-dot ${idx === activeIdx ? 'active' : ''}`}
                        style={idx === activeIdx ? { background: domainMeta.color } : {}}
                        onClick={() => goTo(idx)}
                        aria-label={`Domain ${DOMAIN_META[devId].label}`}
                    />
                ))}
            </div>
        </div>
    );
}
