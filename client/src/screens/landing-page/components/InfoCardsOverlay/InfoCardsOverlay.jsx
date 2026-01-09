import { useRef } from 'react';
import InfoCard from '../InfoCard';
import { getDeveloperByIndex } from '../constants';
import './InfoCardsOverlay.css';

// Info Cards Overlay Component
export default function InfoCardsOverlay({ viewMode, selectedAvatar }) {
    const containerRef = useRef(null);

    if (viewMode !== 'selected') return null;

    // Get the selected developer's data
    const developer = getDeveloperByIndex(selectedAvatar);
    if (!developer) return null;

    return (
        <div className="info-cards-container" ref={containerRef}>
            {/* Dynamically render info cards from developer model */}
            {developer.infoCards.map((card, index) => (
                <InfoCard
                    key={index}
                    containerRef={containerRef}
                    title={card.heading}
                    content={card.description}
                    align={card.position.align}
                    top={card.position.top}
                    left={card.position.left}
                    rotate={card.position.rotate}
                />
            ))}
        </div>
    );
}

