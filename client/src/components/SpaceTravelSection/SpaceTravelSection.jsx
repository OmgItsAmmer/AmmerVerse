import './SpaceTravelSection.css';

/**
 * Wrapper for landing-page sections — scroll depth is driven by useSpaceTravelScroll.
 */
export default function SpaceTravelSection({
    id,
    className = '',
    blur = true,
    mode = 'depth',
    children,
}) {
    return (
        <div
            id={id}
            className={`space-travel-section ${className}`.trim()}
            data-space-travel=""
            data-space-blur={blur ? 'true' : 'false'}
            data-space-mode={mode}
        >
            <div className="space-travel-section__inner">
                {children}
            </div>
        </div>
    );
}
