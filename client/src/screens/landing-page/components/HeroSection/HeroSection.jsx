import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './HeroSection.css';

/* ─── Particle-orb canvas: "materialising from stardust" placeholder ─── */
function ParticleFace() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const W = canvas.clientWidth;
        const H = canvas.clientHeight;
        canvas.width = W;
        canvas.height = H;

        const ctx = canvas.getContext('2d');
        const cx = W / 2;
        const cy = H / 2;

        if (prefersReduced) {
            // Static soft glow
            const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.35);
            g.addColorStop(0, 'rgba(168, 85, 247, 0.25)');
            g.addColorStop(0.6, 'rgba(99, 102, 241, 0.10)');
            g.addColorStop(1, 'transparent');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, W, H);
            return;
        }

        // Head-shaped cluster: slightly taller than wide
        const RX = W * 0.26;
        const RY = H * 0.32;

        // Inner glow ring
        const GLOW_R = W * 0.22;

        const PARTICLE_COUNT = Math.min(320, Math.floor((W * H) / 1400));
        const particles = [];

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            // Distribute uniformly on ellipse surface (Fibonacci spiral)
            const phi = Math.acos(1 - 2 * (i + 0.5) / PARTICLE_COUNT);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            const sx = Math.sin(phi) * Math.cos(theta);
            const sy = Math.cos(phi);

            particles.push({
                // Target position on ellipse
                tx: cx + sx * RX,
                ty: cy + sy * RY,
                // Current position (start scattered)
                x: cx + (Math.random() - 0.5) * W,
                y: cy + (Math.random() - 0.5) * H,
                r: Math.random() * 1.4 + 0.4,
                // Individual phase for breathing effect
                phase: Math.random() * Math.PI * 2,
                speed: 0.4 + Math.random() * 0.6,
                // Colour in violet-indigo range
                hue: 265 + Math.random() * 30,
                alpha: 0.5 + Math.random() * 0.5,
            });
        }

        let t = 0;
        let rafId;

        const draw = () => {
            ctx.clearRect(0, 0, W, H);

            // Ambient glow
            const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, GLOW_R);
            glow.addColorStop(0, 'rgba(168, 85, 247, 0.12)');
            glow.addColorStop(0.5, 'rgba(99, 102, 241, 0.06)');
            glow.addColorStop(1, 'transparent');
            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, W, H);

            const breathe = 1 + Math.sin(t * 0.5) * 0.03; // subtle pulse

            for (const p of particles) {
                // Ease toward target
                p.x += (p.tx - p.x) * 0.012 * p.speed;
                p.y += (p.ty - p.y) * 0.012 * p.speed;

                // Breathe: push radially
                const dx = p.x - cx;
                const dy = p.y - cy;
                p.x = cx + dx * breathe;
                p.y = cy + dy * breathe;

                // Dissolve: occasional stray flicker
                const drift = Math.sin(t * 0.3 + p.phase) * 0.5;
                const flicker = 0.75 + Math.sin(t * 1.1 + p.phase) * 0.25;

                ctx.beginPath();
                ctx.arc(p.x + drift, p.y + drift * 0.4, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 90%, 72%, ${p.alpha * flicker})`;
                ctx.fill();
            }

            t += 0.016;
            rafId = requestAnimationFrame(draw);
        };

        rafId = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(rafId);
    }, []);

    return <canvas ref={canvasRef} className="particle-face-canvas" aria-hidden="true" />;
}

/* ─── Word-by-word fade-up animation ─────────────────────────────────── */
const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
};
const wordVariant = {
    hidden: { opacity: 0, y: 22 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

function AnimatedHeadline({ text, className }) {
    return (
        <motion.h1 className={className} variants={container} initial="hidden" animate="show">
            {text.split(' ').map((word, i) => (
                <motion.span key={i} variants={wordVariant} style={{ display: 'inline-block', marginRight: '0.28em' }}>
                    {word}
                </motion.span>
            ))}
        </motion.h1>
    );
}

/* ─── HeroSection ───────────────────────────────────────────────────── */
export default function HeroSection({ onContactClick }) {
    const scrollToProjects = () => {
        const el = document.getElementById('my-projects');
        if (!el) return;
        if (window.__lenis) {
            window.__lenis.scrollTo(el, { offset: -72, duration: 1.4 });
        } else {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="hero" className="hero-section">
            {/* Gradient mesh overlay */}
            <div className="hero-gradient-mesh" aria-hidden="true" />

            <div className="hero-inner">
                {/* Left — particle face */}
                <div className="hero-face-col">
                    <ParticleFace />
                    <p className="hero-face-hint">[ face particle animation — add photo to complete ]</p>
                </div>

                {/* Right — copy */}
                <motion.div
                    className="hero-copy-col"
                    initial="hidden"
                    animate="show"
                    variants={container}
                >
                    <motion.span className="section-eyebrow" variants={wordVariant}>
                        LLM Engineer · DevOps · LLMOps
                    </motion.span>

                    <AnimatedHeadline text="Ammer Saeed" className="hero-name" />

                    <motion.p className="hero-tagline" variants={wordVariant}>
                        I build systems that think.
                    </motion.p>

                    <motion.p className="hero-sub" variants={wordVariant}>
                        RAG pipelines · AI agents · model serving · CI/CD — production AI from first principles.
                    </motion.p>

                    <motion.div className="hero-ctas" variants={wordVariant}>
                        <button className="cta-primary" onClick={scrollToProjects}>
                            See My Work ↓
                        </button>
                        <button className="cta-secondary" onClick={onContactClick}>
                            Get in Touch
                        </button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll hint */}
            <motion.div
                className="hero-scroll-hint"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.8 }}
                aria-hidden="true"
            >
                <span className="scroll-hint-arrow">↓</span>
            </motion.div>
        </section>
    );
}
