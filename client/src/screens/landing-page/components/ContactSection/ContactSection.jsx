import { motion } from 'framer-motion';
import Starfield from '../Starfield/Starfield.jsx';
import './ContactSection.css';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.1 } },
};

export default function ContactSection({ onContactClick, onResumeDownload }) {
    return (
        <section id="contact" className="contact-section">
            <Starfield variant="scoped" />
            <div className="contact-glow" aria-hidden="true" />

            <motion.div
                className="contact-inner"
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
            >
                <motion.span className="section-eyebrow" variants={fadeUp}>
                    Contact
                </motion.span>

                <motion.h2 className="contact-headline" variants={fadeUp}>
                    Let's build something<br />
                    <span className="contact-headline-accent">that thinks.</span>
                </motion.h2>

                <motion.p className="contact-status" variants={fadeUp}>
                    <span className="status-dot" aria-hidden="true" />
                    Open to LLM Engineer &amp; LLMOps roles &mdash; remote-friendly
                </motion.p>

                <motion.div className="contact-ctas" variants={fadeUp}>
                    <button className="cta-primary" onClick={onContactClick}>
                        Send a Message
                    </button>
                </motion.div>

                <motion.div className="contact-links" variants={fadeUp}>
                    <a
                        href="https://github.com/OmgItsAmmer"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-link"
                    >
                        GitHub
                    </a>
                    <span className="contact-link-sep" aria-hidden="true">·</span>
                    <a
                        href="https://linkedin.com/in/ammersaeed21"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-link"
                    >
                        LinkedIn
                    </a>
                    <span className="contact-link-sep" aria-hidden="true">·</span>
                    <a
                        href="mailto:ammersaeed@example.com"
                        className="contact-link"
                    >
                        Email
                    </a>
                </motion.div>
            </motion.div>

            {/* Footer */}
            <motion.footer
                className="site-footer"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                viewport={{ once: true }}
            >
                <p>© Ammer Saeed · <span className="footer-brand">AmmerVerse</span></p>
            </motion.footer>
        </section>
    );
}
