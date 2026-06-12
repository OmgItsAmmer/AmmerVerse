import './celestial-orrery.css';

/**
 * Wide radial gaps — each orbit radius spaced so planet bodies never touch
 * when aligned. `--planet-scale` = fraction of orrery diameter.
 */
const ORBITS = [
    { orbit: 36, duration: 19, startAngle: 0,   reverse: false, id: 'mars',    scale: 0.055 },
    { orbit: 54, duration: 27, startAngle: 90,  reverse: true,  id: 'earth',   scale: 0.058 },
    { orbit: 72, duration: 37, startAngle: 180, reverse: false, id: 'jupiter', scale: 0.072 },
    { orbit: 90, duration: 51, startAngle: 270, reverse: true,  id: 'saturn',  scale: 0.062 },
];

export function CelestialOrrery({ className = '', style }) {
    return (
        <div
            className={`celestial-orrery ${className}`.trim()}
            style={style}
            aria-hidden="true"
        >
            <div className="orrery-field">
                <div className="orrery-sun" title="Sun" />

                {ORBITS.map((ring) => (
                    <div
                        key={ring.id}
                        className={`orbit${ring.reverse ? ' orbit--reverse' : ''}`}
                        style={{
                            '--orbit-size': `${ring.orbit}%`,
                            '--orbit-duration': `${ring.duration}s`,
                            '--start-angle': `${ring.startAngle}deg`,
                        }}
                    >
                        <div
                            className={`planet planet--${ring.id}`}
                            style={{ '--planet-scale': ring.scale }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CelestialOrrery;
