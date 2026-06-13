import { Component, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ParticleSphere } from '../../../../components/ui/cosmos-3d-orbit-gallery.jsx';
import './CosmosDomainSlider.css';

const DRAG_THRESHOLD = 8;

class CanvasErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error) {
        console.warn('[CosmosDomainSlider] WebGL gallery failed, using overlay only.', error);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

function CosmosCanvas({ activeIndex, domainCount, images }) {
    return (
        <Canvas
            className="cosmos-domain-slider__canvas"
            camera={{ position: [-10, 1.5, 10], fov: 50 }}
            dpr={[1, 1.25]}
            gl={{
                alpha: true,
                antialias: true,
                powerPreference: 'high-performance',
                failIfMajorPerformanceCaveat: false,
            }}
        >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Suspense fallback={null}>
                <ParticleSphere
                    images={images}
                    activeIndex={activeIndex}
                    domainCount={domainCount}
                />
            </Suspense>
        </Canvas>
    );
}

export default function CosmosDomainSlider({
    className = '',
    activeIndex,
    onActiveChange,
    domainCount,
    images,
    children,
}) {
    const rootRef = useRef(null);
    const dragRef = useRef({ pointerId: null, startX: 0, moved: false });
    const [isDragging, setIsDragging] = useState(false);
    const [canvasReady, setCanvasReady] = useState(false);

    useEffect(() => {
        const id = window.requestAnimationFrame(() => setCanvasReady(true));
        return () => window.cancelAnimationFrame(id);
    }, []);

    const snapToIndex = useCallback(
        (index) => {
            const normalized = ((index % domainCount) + domainCount) % domainCount;
            onActiveChange(normalized);
        },
        [domainCount, onActiveChange]
    );

    const handlePointerDown = (event) => {
        if (event.button !== 0) return;
        if (
            event.target.closest(
                '.domain-mini-card, .carousel-tab, .carousel-dot, .carousel-arrow, button, a'
            )
        ) {
            return;
        }

        dragRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            moved: false,
        };
        rootRef.current?.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event) => {
        const drag = dragRef.current;
        if (drag.pointerId !== event.pointerId) return;

        const deltaX = event.clientX - drag.startX;
        if (!drag.moved && Math.abs(deltaX) < DRAG_THRESHOLD) return;

        if (!drag.moved) {
            drag.moved = true;
            setIsDragging(true);
            window.__lenis?.stop();
        }
    };

    const finishDrag = (event) => {
        const drag = dragRef.current;
        if (drag.pointerId !== event.pointerId) return;

        if (rootRef.current?.hasPointerCapture(event.pointerId)) {
            rootRef.current.releasePointerCapture(event.pointerId);
        }

        if (drag.moved) {
            const deltaX = event.clientX - drag.startX;
            if (deltaX > 40) snapToIndex(activeIndex - 1);
            else if (deltaX < -40) snapToIndex(activeIndex + 1);
        }

        dragRef.current.pointerId = null;
        setIsDragging(false);
        window.__lenis?.start();
    };

    return (
        <div
            ref={rootRef}
            className={`cosmos-domain-slider${isDragging ? ' cosmos-domain-slider--dragging' : ''} ${className}`.trim()}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
        >
            {canvasReady && (
                <CanvasErrorBoundary fallback={null}>
                    <CosmosCanvas
                        activeIndex={activeIndex}
                        domainCount={domainCount}
                        images={images}
                    />
                </CanvasErrorBoundary>
            )}

            <div className="cosmos-domain-slider__overlay">{children}</div>
        </div>
    );
}
