import { useState } from 'react';
import { motion } from 'framer-motion';
import './InfoCard.css';

// Info Card Component
export default function InfoCard({ title, content, align, containerRef, top, left, rotate, className }) {
    const [zIndex, setZIndex] = useState(0);

    const updateZIndex = () => {
        const els = document.querySelectorAll(".info-card");
        let maxZIndex = 0;

        els.forEach((el) => {
            let zIndex = parseInt(
                window.getComputedStyle(el).getPropertyValue("z-index")
            );

            if (!isNaN(zIndex) && zIndex > maxZIndex) {
                maxZIndex = zIndex;
            }
        });

        setZIndex(maxZIndex + 1);
    };

    // Check if this is a mobile card (className includes 'mobile-info-card')
    const isMobileCard = className && className.includes('mobile-info-card');

    return (
        <motion.div
            className={`info-card ${align} ${className || ''}`}
            style={{
                top: isMobileCard ? undefined : top,
                left: isMobileCard ? undefined : left,
                rotate: isMobileCard ? undefined : rotate,
                zIndex,
                position: isMobileCard ? 'relative' : 'absolute'
            }}
            drag={!isMobileCard}
            dragConstraints={isMobileCard ? undefined : containerRef}
            dragElastic={isMobileCard ? undefined : 0.65}
            onMouseDown={isMobileCard ? undefined : updateZIndex}
            whileDrag={isMobileCard ? undefined : { scale: 1.1, cursor: 'grabbing' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h3 className="info-card-title">{title}</h3>
            <p className="info-card-content">{content}</p>
        </motion.div>
    );
}

