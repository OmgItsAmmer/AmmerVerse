import { motion } from 'framer-motion';
import './HeroSection.css';
import { CelestialOrrery } from '../../../../components/ui/celestial-orrery.jsx';

const AMMER = 'Ammer';
const VERSE = 'Verse';
const HALF_LEN = 5;

/**
 * Symmetric Z-depth from the center icon outward.
 * Ammer: r (last) & Verse: V (first) recede — A & e (outer ends) zoom forward.
 */
function getSyncedZStyle(side, index) {
    const distFromCenter =
        side === 'left' ? HALF_LEN - 1 - index : index;
    const t = distFromCenter / (HALF_LEN - 1);

    const scale = 0.88 + t * 0.27;
    const translateZ = t * 56;

    return {
        transform: `translateZ(${translateZ}px) scale(${scale})`,
        zIndex: Math.round(t * 100),
        opacity: 0.86 + t * 0.14,
    };
}

function BrandLetters({ word, side }) {
    return word.split('').map((char, i) => (
        <span
            key={`${side}-${char}-${i}`}
            className="hero-brand-letter"
            style={getSyncedZStyle(side, i)}
            aria-hidden="true"
        >
            {char}
        </span>
    ));
}

export default function HeroSection() {
    return (
        <section id="hero" className="hero-section">
            <div className="hero-glow hero-glow--top" aria-hidden="true" />
            <div className="hero-glow hero-glow--bottom" aria-hidden="true" />

            <div className="hero-center">
                <motion.h1
                    className="hero-headline"
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="hero-brand-stack">
                        <span className="hero-welcome">Welcome to</span>

                        <div className="hero-brand-z" aria-label="AmmerVerse">
                            <span className="hero-brand-track">
                                <span className="hero-brand-half hero-brand-half--left">
                                    <BrandLetters word={AMMER} side="left" />
                                </span>

                                <span
                                    className="hero-brand-orrery-wrap"
                                    style={getSyncedZStyle('left', HALF_LEN - 1)}
                                >
                                    <CelestialOrrery />
                                </span>

                                <span className="hero-brand-half hero-brand-half--right">
                                    <BrandLetters word={VERSE} side="right" />
                                </span>
                            </span>
                        </div>
                    </div>
                </motion.h1>
            </div>

            <motion.div
                className="hero-scroll-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                aria-hidden="true"
            >
                <span className="scroll-hint-arrow">↓</span>
            </motion.div>
        </section>
    );
}
