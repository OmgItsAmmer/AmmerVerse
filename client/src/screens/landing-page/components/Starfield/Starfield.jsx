import './Starfield.css';

// Starfield background component
export default function Starfield() {
    return (
        <div className="starfield">
            {[...Array(100)].map((_, i) => (
                <div
                    key={i}
                    className="star"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        opacity: Math.random() * 0.7 + 0.3
                    }}
                />
            ))}
        </div>
    );
}

