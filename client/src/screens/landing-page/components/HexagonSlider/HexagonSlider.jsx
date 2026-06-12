import { useCallback, useEffect, useRef, useState } from 'react';
import './HexagonSlider.css';

const DRAG_THRESHOLD = 6;
const DRAG_SENSITIVITY = 0.35;

/**
 * CSS 3D prism carousel — same technique as Leonardo.ai's hexagon slider:
 * each face is rotated around Y and pushed forward with translateZ.
 */
export default function HexagonSlider({
    sideCount,
    activeIndex,
    onActiveChange,
    children,
    className = '',
    autoAdvanceMs = 0,
    pauseOnHover = true,
}) {
    const angleStep = 360 / sideCount;

    const rootRef = useRef(null);
    const dragState = useRef({
        pointerId: null,
        startX: 0,
        startRotation: 0,
        moved: false,
    });

    const [faceSize, setFaceSize] = useState({ width: 900, height: 700 });
    const [rotation, setRotation] = useState(activeIndex * angleStep);
    const [isDragging, setIsDragging] = useState(false);
    const pauseRef = useRef(false);

    const translateZ = faceSize.width / (2 * Math.tan(Math.PI / sideCount));

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return undefined;

        const updateSize = () => {
            const { width, height } = el.getBoundingClientRect();
            setFaceSize({
                width: Math.max(320, width * 0.96),
                height: Math.max(320, height * 0.94),
            });
        };

        updateSize();
        const observer = new ResizeObserver(updateSize);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isDragging) {
            setRotation(activeIndex * angleStep);
        }
    }, [activeIndex, angleStep, isDragging]);

    const snapToIndex = useCallback(
        (index) => {
            const normalized = ((index % sideCount) + sideCount) % sideCount;
            setRotation(normalized * angleStep);
            onActiveChange(normalized);
        },
        [angleStep, onActiveChange, sideCount]
    );

    const snapRotation = useCallback(
        (currentRotation) => {
            const nearest = Math.round(currentRotation / angleStep);
            snapToIndex(nearest);
        },
        [angleStep, snapToIndex]
    );

    const handlePointerDown = (event) => {
        if (event.button !== 0) return;
        if (event.target.closest('.project-card-wrapper, button, a, .carousel-tab, .carousel-dot')) {
            return;
        }

        dragState.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startRotation: rotation,
            moved: false,
        };

        rootRef.current?.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event) => {
        const drag = dragState.current;
        if (drag.pointerId !== event.pointerId) return;

        const deltaX = event.clientX - drag.startX;
        if (!drag.moved && Math.abs(deltaX) < DRAG_THRESHOLD) return;

        if (!drag.moved) {
            drag.moved = true;
            setIsDragging(true);
        }

        setRotation(drag.startRotation + deltaX * DRAG_SENSITIVITY);
    };

    const finishDrag = (event) => {
        const drag = dragState.current;
        if (drag.pointerId !== event.pointerId) return;

        if (rootRef.current?.hasPointerCapture(event.pointerId)) {
            rootRef.current.releasePointerCapture(event.pointerId);
        }

        if (drag.moved) {
            const finalRotation =
                drag.startRotation + (event.clientX - drag.startX) * DRAG_SENSITIVITY;
            snapRotation(finalRotation);
        }

        dragState.current.pointerId = null;
        setIsDragging(false);
    };

    useEffect(() => {
        if (!autoAdvanceMs) return undefined;

        const timer = setInterval(() => {
            if (pauseRef.current || isDragging) return;
            snapToIndex(activeIndex + 1);
        }, autoAdvanceMs);

        return () => clearInterval(timer);
    }, [activeIndex, autoAdvanceMs, isDragging, snapToIndex]);

    const faces = Array.isArray(children) ? children : [children];

    return (
        <div
            ref={rootRef}
            className={`prism-slider${isDragging ? ' prism-slider--dragging' : ''} ${className}`.trim()}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
            onMouseEnter={pauseOnHover ? () => { pauseRef.current = true; } : undefined}
            onMouseLeave={pauseOnHover ? () => { pauseRef.current = false; } : undefined}
            style={{
                '--face-width': `${faceSize.width}px`,
                '--face-height': `${faceSize.height}px`,
                '--angle-step': `${angleStep}deg`,
                '--translate-z': `${translateZ}px`,
                '--rotation': `${rotation}deg`,
            }}
        >
            <div className="prism-slider__prism">
                {faces.map((face, index) => (
                    <div
                        key={index}
                        className="prism-slider__face"
                        style={{ '--face-index': index }}
                        data-index={index}
                    >
                        <div className="prism-slider__face-inner">{face}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
