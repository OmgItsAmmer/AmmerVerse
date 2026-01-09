import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import './ProjectCard.css';

// Sub-components for different card types
const PhoneCard = ({ project }) => (
    <div className="project-card-inner phone-card">
        <div className="phone-notch"></div>
        <div className="phone-screen">
            <div className="project-preview">
                <span className="project-title-preview">{project.name}</span>
            </div>
        </div>
        <div className="phone-home-bar"></div>
    </div>
);

const BrowserCard = ({ project }) => (
    <div className="project-card-inner browser-card">
        <div className="browser-header">
            <div className="browser-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
            </div>
            <div className="browser-address-bar">
                <span>ammerverse.com/{project.name.toLowerCase().replace(/\s/g, '-')}</span>
            </div>
        </div>
        <div className="browser-content">
            <div className="project-preview">
                <span className="project-title-preview">{project.name}</span>
            </div>
        </div>
    </div>
);

const DesktopCard = ({ project }) => (
    <div className="project-card-inner desktop-card">
        <div className="desktop-title-bar">
            <span className="desktop-app-title">{project.name}</span>
            <div className="desktop-controls">
                <span>_</span>
                <span>□</span>
                <span>×</span>
            </div>
        </div>
        <div className="desktop-content">
            
            <div className="project-main-area">
                {project.images && project.images.length > 0 ? (
                    <img
                        src={project.images[0]}
                        alt={project.name}
                        className="project-image-preview"
                    />
                ) : (
                    <span className="project-title-preview">{project.name}</span>
                )}
            </div>
        </div>
    </div>
);

const DefaultCard = ({ project }) => (
    <div className="project-card-inner default-card">
        <div className="default-content">
            <span className="project-title-preview">{project.name}</span>
        </div>
    </div>
);

// Main Project Card Component
export default function ProjectCard({ project, onClick, top, left, rotate, category }) {
    const [zIndex, setZIndex] = useState(0);

    const updateZIndex = () => {
        const els = document.querySelectorAll(".project-card-wrapper");
        let maxZIndex = 0;

        els.forEach((el) => {
            const currentZIndex = parseInt(
                globalThis.window?.getComputedStyle(el).getPropertyValue("z-index") || "0"
            );

            if (!isNaN(currentZIndex) && currentZIndex > maxZIndex) {
                maxZIndex = currentZIndex;
            }
        });

        setZIndex(maxZIndex + 1);
    };

    const renderCardContent = () => {
        switch (category) {
            case 'mobile':
                return <PhoneCard project={project} />;
            case 'web':
                return <BrowserCard project={project} />;
            case 'desktop':
                return <DesktopCard project={project} />;
            default:
                return <DefaultCard project={project} />;
        }
    };

    const isWide = category === 'web' || category === 'desktop';

    const categoryClass =
        category === 'mobile'
            ? 'mobile-card-wrapper'
            : category === 'web'
            ? 'web-card-wrapper'
            : category === 'desktop'
            ? 'desktop-card-wrapper'
            : '';

    return (
        <motion.div
            className={`project-card-wrapper ${isWide ? 'wide' : ''} ${categoryClass}`}
            style={{
                top,
                left,
                rotate,
                zIndex,
                position: 'absolute'
            }}
            onMouseDown={updateZIndex}
            onClick={() => onClick(project)}
            whileHover={{ scale: 1.05, cursor: 'pointer' }}
            initial={{ opacity: 0, scale: 0.8, y: 0 }}
            animate={{
                opacity: 1,
                scale: 1,
                y: [0, -10, 0],
                x: [0, 5, 0]
            }}
            transition={{
                duration: 0.5, // Entry animation
                y: {
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: Math.random() * 2
                },
                x: {
                    duration: 4 + Math.random() * 2, // Slightly different duration for organic feel
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: Math.random() * 2
                }
            }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
        >
            {renderCardContent()}
            <div className="project-info-tooltip">
                <h4>{project.name}</h4>
                <p>Click for details</p>
            </div>
        </motion.div>
    );
}

