import { useEffect, useMemo, useRef, useState } from 'react';
import Starfield from '../Starfield/Starfield.jsx';
import { STACKURN_LAYERS, getIconUrl } from '../../data/stackurnLogos.js';
import { buildStackurnLayouts } from '../../data/stackurnLayout.js';
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
        return 58 * scale;
    }
    return STACKURN_LAYERS[layerIndex + 1].radius * scale + 16;
}

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

function OrbitRing({
    layer,
    layerIndex,
    layout,
    rotation,
    onRotationChange,
    scale = 1,
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
            el.style.transform = `translate(-50%, -50%) rotate(${-deg}deg)`;
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
                        <div className="stackurn-logo-counter">
                            <LogoItem logo={logo} />
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

export default function StackurnSection() {
    const layouts = useMemo(() => buildStackurnLayouts(STACKURN_LAYERS), []);
    const [rotations, setRotations] = useState(() =>
        Object.fromEntries(layouts.map((l) => [l.layerId, l.ringOffset]))
    );
    const isMobile = useIsMobile();
    const ringScale = isMobile ? 0.52 : 1;

    return (
        <section id="stackurn" className="stackurn-section">
            <Starfield variant="scoped" />

            <div className="stackurn-inner">
                <div className="stackurn-header">
                    <span className="section-eyebrow">Technology</span>
                    <h2 className="stackurn-title">Stackurn</h2>
                    <p className="stackurn-subtitle">The stacks I ship with.</p>
                    <p className="stackurn-hint">Drag a ring track to spin that layer</p>
                </div>

                <div className="stackurn-system">
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
                        />
                    ))}

                    <div className="stackurn-center">
                        <SaturnPlanet />
                    </div>
                </div>

                <div className="stackurn-legend">
                    {STACKURN_LAYERS.map((layer) => (
                        <div key={layer.id} className="stackurn-legend-item">
                            <span className="legend-dot" style={{ background: layer.color }} />
                            <span>
                                {layer.id === 'frontend' ? 'Outer' : layer.id === 'db' ? 'Inner' : '·'} —{' '}
                                {layer.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
