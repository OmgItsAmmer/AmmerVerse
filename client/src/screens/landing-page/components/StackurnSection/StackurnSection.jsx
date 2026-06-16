import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Starfield from '../Starfield/Starfield.jsx';
import ProjectCard from '../ProjectCard';
import { PROJECTS } from '../../data/developerModels.js';
import { STACKURN_LAYERS, STACKURN_RING_TRACK_PAD, STACKURN_SATURN_INNER_RADIUS, getIconUrl } from '../../data/stackurnLogos.js';
import { buildStackurnLayouts } from '../../data/stackurnLayout.js';
import { matchProjectsByStacks } from '../../data/stackurnQuery.js';
import { useIsMobile } from '../../../../hooks/useMediaQuery';
import './StackurnSection.css';

function getPointerAngleDeg(clientX, clientY, centerX, centerY) {
    return (Math.atan2(clientY - centerY, clientX - centerX) * 180) / Math.PI;
}

function normalizeAngleDelta(delta) {
    let d = delta;
    while (d > 180) d -= 360;
    while (d < -180) d += 360;
    return d;
}

function getInnerRadiusPx(layerIndex, scale) {
    if (layerIndex >= STACKURN_LAYERS.length - 1) {
        return STACKURN_SATURN_INNER_RADIUS * scale;
    }
    return STACKURN_LAYERS[layerIndex + 1].radius * scale + STACKURN_RING_TRACK_PAD;
}

function LogoItem({ logo, selectable, selected, onToggle }) {
    const [imgOk, setImgOk] = useState(true);
    const src = getIconUrl(logo.slug, logo.color);

    const handleClick = (event) => {
        if (!selectable) return;
        event.stopPropagation();
        onToggle?.(logo.slug);
    };

    const handlePointerDown = (event) => {
        if (selectable) {
            event.stopPropagation();
        }
    };

    return (
        <button
            type="button"
            className={`stackurn-logo-item${selectable ? ' stackurn-logo-item--selectable' : ''}${selected ? ' stackurn-logo-item--selected' : ''}`}
            title={logo.name}
            onClick={handleClick}
            onPointerDown={handlePointerDown}
            disabled={!selectable}
            aria-pressed={selectable ? selected : undefined}
        >
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
            {selected && <span className="stackurn-logo-check" aria-hidden="true">✓</span>}
        </button>
    );
}

function OrbitRing({
    layer,
    layerIndex,
    layout,
    rotation,
    onRotationChange,
    scale = 1,
    isPlayMode,
    selectedSlugs,
    onToggleSlug,
}) {
    const { radius: baseRadius, color, label } = layer;
    const outerR = baseRadius * scale;
    const innerR = getInnerRadiusPx(layerIndex, scale);
    const ringVisualRef = useRef(null);
    const trackRef = useRef(null);
    const dragRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const logos = layout?.logos ?? layer.logos;

    const applyRotation = (deg) => {
        if (ringVisualRef.current) {
            ringVisualRef.current.style.transform = `translate(-50%, -50%) rotate(${deg}deg)`;
        }
        ringVisualRef.current?.querySelectorAll('.stackurn-logo-counter').forEach((el) => {
            const slotAngle = Number(el.dataset.slotAngle ?? 0);
            el.style.transform = `translate(-50%, -50%) rotate(${-deg - slotAngle}deg)`;
        });
    };

    useEffect(() => {
        if (!isDragging) {
            applyRotation(rotation);
        }
    }, [rotation, isDragging]);

    const finishDrag = (event) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;

        if (trackRef.current?.hasPointerCapture(event.pointerId)) {
            trackRef.current.releasePointerCapture(event.pointerId);
        }

        onRotationChange(drag.liveRotation);
        dragRef.current = null;
        setIsDragging(false);
        window.__lenis?.start();
    };

    const handlePointerDown = (event) => {
        if (event.button !== 0) return;

        event.preventDefault();
        event.stopPropagation();
        window.__lenis?.stop();

        const rect = trackRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        dragRef.current = {
            pointerId: event.pointerId,
            centerX,
            centerY,
            startAngle: getPointerAngleDeg(event.clientX, event.clientY, centerX, centerY),
            startRotation: rotation,
            liveRotation: rotation,
        };

        trackRef.current?.setPointerCapture(event.pointerId);
        setIsDragging(true);
    };

    const handlePointerMove = (event) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;

        event.preventDefault();

        const angle = getPointerAngleDeg(
            event.clientX,
            event.clientY,
            drag.centerX,
            drag.centerY
        );
        const delta = normalizeAngleDelta(angle - drag.startAngle);
        drag.liveRotation = drag.startRotation + delta;
        applyRotation(drag.liveRotation);
    };

    return (
        <div
            className="stackurn-orbit-ring"
            style={{ '--ring-color': color, zIndex: layerIndex + 1 }}
            data-layer={layer.id}
        >
            <div
                ref={trackRef}
                className={`stackurn-ring-track${isDragging ? ' stackurn-ring-track--dragging' : ''}`}
                style={{
                    '--outer-r': `${outerR}px`,
                    '--inner-r': `${innerR}px`,
                }}
                aria-label={`Rotate ${label} layer`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={finishDrag}
                onPointerCancel={finishDrag}
            />

            <div
                ref={ringVisualRef}
                className="stackurn-orbit-visual"
                style={{
                    width: `${outerR * 2}px`,
                    height: `${outerR * 2}px`,
                }}
            >
                <span className="stackurn-ring-label">{label}</span>
                {logos.map((logo) => (
                    <div
                        key={logo.slug}
                        className="stackurn-logo-orbit-slot"
                        style={{
                            transform: `rotate(${logo.angle}deg) translateX(${outerR}px)`,
                        }}
                    >
                        <div
                            className="stackurn-logo-counter"
                            data-slot-angle={logo.angle}
                        >
                            <LogoItem
                                logo={logo}
                                selectable={isPlayMode}
                                selected={selectedSlugs.has(logo.slug)}
                                onToggle={onToggleSlug}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

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

function StackurnResultsPanel({ projects, selectedCount, onProjectClick, isVisible }) {
    const hasMatches = projects.length > 0;

    return (
        <div
            className={`stackurn-results-panel${isVisible ? ' stackurn-results-panel--visible' : ''}`}
            data-lenis-prevent={isVisible ? '' : undefined}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            aria-live="polite"
            aria-hidden={!isVisible}
        >
            {!hasMatches ? (
                <div className="stackurn-how-to-play">
                    <span className="stackurn-results-eyebrow">How to play</span>
                    <h3 className="stackurn-how-to-play-title">Find projects by stack</h3>
                    {selectedCount > 0 ? (
                        <p className="stackurn-how-to-play-text">
                            No projects match this exact combo — try removing a stack or pick
                            different layers.
                        </p>
                    ) : (
                        <ol className="stackurn-how-to-play-steps">
                            <li>Click tech logos on any ring layer</li>
                            <li>Select zero or more from each layer</li>
                            <li>We&apos;ll surface projects that use every stack you picked</li>
                            <li>Click a project card to open details</li>
                        </ol>
                    )}
                    <p className="stackurn-how-to-play-tip">
                        Tip: drag a ring track to spin that layer and browse stacks.
                    </p>
                </div>
            ) : (
                <div className="stackurn-results">
                    <p className="stackurn-results-count">
                        {projects.length} project{projects.length === 1 ? '' : 's'} matched
                    </p>
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            category={project.category}
                            onClick={onProjectClick}
                            top="50%"
                            left="50%"
                            rotate="0deg"
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function StackurnSection({ onProjectClick }) {
    const layouts = useMemo(() => buildStackurnLayouts(STACKURN_LAYERS), []);
    const [rotations, setRotations] = useState(() =>
        Object.fromEntries(layouts.map((l) => [l.layerId, l.ringOffset]))
    );
    const [isPlayMode, setIsPlayMode] = useState(false);
    const [selectedSlugs, setSelectedSlugs] = useState([]);

    const [viewportHeight, setViewportHeight] = useState(
        typeof window !== 'undefined' ? window.innerHeight : 900
    );

    useEffect(() => {
        const onResize = () => setViewportHeight(window.innerHeight);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const isMobile = useIsMobile();
    const baseRingScale = isMobile ? 0.38 : 0.42;

    const { orbitBoxSize, ringScale } = useMemo(() => {
        const naturalOuterR = STACKURN_LAYERS[0].radius * baseRingScale;
        const naturalSize = Math.ceil(naturalOuterR * 2 + 56);
        const maxSize = Math.floor(viewportHeight * 0.84);
        const size = Math.min(naturalSize, maxSize);
        const scaleFactor = size / naturalSize;

        return {
            orbitBoxSize: size,
            ringScale: baseRingScale * scaleFactor,
        };
    }, [baseRingScale, viewportHeight]);

    const selectedSlugSet = useMemo(() => new Set(selectedSlugs), [selectedSlugs]);

    const matchedProjects = useMemo(
        () => matchProjectsByStacks(selectedSlugs, PROJECTS),
        [selectedSlugs]
    );

    const toggleSlug = useCallback((slug) => {
        setSelectedSlugs((prev) =>
            prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
        );
    }, []);

    const resetSelection = () => setSelectedSlugs([]);

    const togglePlayMode = () => {
        setIsPlayMode((prev) => !prev);
    };

    return (
        <section className={`stackurn-section${isPlayMode ? ' stackurn-section--play-mode' : ''}`}>
            <Starfield variant="scoped" />

            <div className={`stackurn-inner${isPlayMode ? ' stackurn-inner--play-mode' : ''}`}>
                <aside className="stackurn-sidebar">
                    <div className="stackurn-idle-heading">
                        <span className="section-eyebrow">Technology</span>
                        <h2 className="stackurn-title">Stackturn</h2>
                        <button
                            type="button"
                            className="stackurn-play-btn"
                            onClick={togglePlayMode}
                        >
                            <span className="stackurn-play-btn-glow" aria-hidden="true" />
                            Let&apos;s Play
                        </button>
                    </div>
                </aside>

                <div className="stackurn-main">
                    <div className={`stackurn-play-controls${isPlayMode ? ' stackurn-play-controls--visible' : ''}`}>
                        <button
                            type="button"
                            className="stackurn-play-btn stackurn-play-btn--secondary"
                            onClick={resetSelection}
                            disabled={!isPlayMode || selectedSlugs.length === 0}
                        >
                            Reset
                        </button>
                        <button
                            type="button"
                            className="stackurn-play-btn stackurn-play-btn--active"
                            onClick={togglePlayMode}
                        >
                            Exit
                        </button>
                    </div>

                    <div className="stackurn-play-layout">
                        <div className="stackurn-stage">
                            <div className="stackurn-orbit-column">
                                <div
                                    className="stackurn-system"
                                    style={{
                                        width: `${orbitBoxSize}px`,
                                        height: `${orbitBoxSize}px`,
                                        '--ring-scale': ringScale,
                                    }}
                                >
                                    {STACKURN_LAYERS.map((layer, index) => (
                                        <OrbitRing
                                            key={layer.id}
                                            layer={layer}
                                            layerIndex={index}
                                            layout={layouts.find((l) => l.layerId === layer.id)}
                                            rotation={rotations[layer.id]}
                                            onRotationChange={(value) =>
                                                setRotations((prev) => ({ ...prev, [layer.id]: value }))
                                            }
                                            scale={ringScale}
                                            isPlayMode={isPlayMode}
                                            selectedSlugs={selectedSlugSet}
                                            onToggleSlug={toggleSlug}
                                        />
                                    ))}

                                    <div className="stackurn-center">
                                        <SaturnPlanet />
                                    </div>
                                </div>
                            </div>

                            <aside
                                className={`stackurn-legend stackurn-legend--side${isPlayMode ? ' stackurn-legend--hidden' : ''}`}
                                aria-label="Ring layers"
                            >
                                {STACKURN_LAYERS.map((layer) => (
                                    <div key={layer.id} className="stackurn-legend-item">
                                        <span className="legend-dot" style={{ background: layer.color }} />
                                        <span>
                                            {layer.id === 'frontend'
                                                ? 'Outer'
                                                : layer.id === 'db'
                                                  ? 'Inner'
                                                  : '·'}{' '}
                                            — {layer.label}
                                        </span>
                                    </div>
                                ))}
                            </aside>
                        </div>

                        <StackurnResultsPanel
                            projects={matchedProjects}
                            selectedCount={selectedSlugs.length}
                            onProjectClick={onProjectClick}
                            isVisible={isPlayMode}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
