import { useState } from 'react';
import { motion } from 'framer-motion';
import EarthModel from '../EarthModel';
import { CLIENTS, DEPLOYMENT_STATS, HIGHLIGHTS } from '../../data/achievements.js';
import './AchievementsSection.css';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.1 } },
};

export default function AchievementsSection() {
    const [isEarthZoomed, setIsEarthZoomed] = useState(false);

    return (
        <section id="achievements" className="achievements-section">
            <div className="achievements-inner">
                {/* Left panel */}
                <motion.div
                    className="achievements-left"
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-80px' }}
                >
                    <motion.span className="section-eyebrow" variants={fadeUp}>
                        Achievements
                    </motion.span>
                    <motion.h2 className="achievements-title" variants={fadeUp}>
                        Built for real clients.<br />Deployed in production.
                    </motion.h2>

                    {/* Stats */}
                    <motion.div className="achievements-stats" variants={stagger}>
                        {DEPLOYMENT_STATS.map((stat) => (
                            <motion.div key={stat.label} className="stat-card glass-card" variants={fadeUp}>
                                <span className="stat-value">{stat.value}</span>
                                <span className="stat-label">{stat.label}</span>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Client list */}
                    <motion.div className="achievements-clients" variants={fadeUp}>
                        <h3 className="clients-heading">Client work</h3>
                        <ul className="clients-list">
                            {CLIENTS.map((c) => (
                                <li key={c.name} className="client-item">
                                    <span className="client-dot" />
                                    <div>
                                        <span className="client-name">{c.name}</span>
                                        <span className="client-project"> · {c.project}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Highlights */}
                    <motion.div className="achievements-highlights" variants={fadeUp}>
                        <h3 className="clients-heading">Deployment highlights</h3>
                        <ul className="highlights-list">
                            {HIGHLIGHTS.map((h) => (
                                <li key={h} className="highlight-item">
                                    <span className="highlight-arrow">→</span>
                                    {h}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </motion.div>

                {/* Right panel — Mapbox globe */}
                <motion.div
                    className="achievements-globe-col"
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true, margin: '-80px' }}
                >
                    <EarthModel
                        embedded={true}
                        isZoomed={isEarthZoomed}
                        onEarthClick={() => setIsEarthZoomed(true)}
                        onClose={() => setIsEarthZoomed(false)}
                    />
                    <p className="globe-caption">
                        Click the globe to explore client geography · ESC to close
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
