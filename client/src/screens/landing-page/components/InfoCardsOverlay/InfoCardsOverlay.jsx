import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import InfoCard from '../InfoCard';
import { getDeveloperByIndex } from '../constants';
import { useIsMobile } from '../../../../hooks/useMediaQuery';
import './InfoCardsOverlay.css';

// Info Cards Overlay Component
export default function InfoCardsOverlay({ viewMode, selectedAvatar }) {
    const containerRef = useRef(null);
    const isMobile = useIsMobile();
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    if (viewMode !== 'selected') return null;

    // Get the selected developer's data
    const developer = getDeveloperByIndex(selectedAvatar);
    if (!developer) return null;

    const cards = developer.infoCards;

    // Mobile: Handle swipe navigation
    const handleMobileNext = (e) => {
        e.stopPropagation();
        setDirection(1);
        setCurrentCardIndex((prev) => (prev + 1) % cards.length);
    };

    const handleMobilePrev = (e) => {
        e.stopPropagation();
        setDirection(-1);
        setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
    };

    // Mobile View: Single Card with Swipe
    if (isMobile) {
        const currentCard = cards[currentCardIndex];
        
        return (
            <div className="info-cards-container mobile-info-cards" ref={containerRef}>
                {/* Navigation Arrows */}
                <button className="mobile-card-arrow left" onClick={handleMobilePrev}>
                    ‹
                </button>

                {/* Single Card with Animation */}
                <AnimatePresence mode="wait" initial={false} custom={direction}>
                    <motion.div
                        key={currentCardIndex}
                        custom={direction}
                        variants={{
                            enter: (direction) => ({
                                x: direction > 0 ? 300 : -300,
                                opacity: 0,
                                rotateY: direction > 0 ? 45 : -45,
                            }),
                            center: {
                                zIndex: 1,
                                x: 0,
                                opacity: 1,
                                rotateY: 0,
                            },
                            exit: (direction) => ({
                                zIndex: 0,
                                x: direction < 0 ? 300 : -300,
                                opacity: 0,
                                rotateY: direction < 0 ? 45 : -45,
                            }),
                        }}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: 'spring', stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                            rotateY: { duration: 0.3 },
                        }}
                        className="mobile-card-container"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = Math.abs(offset.x) * velocity.x;
                            if (swipe < -500) {
                                handleMobileNext(e);
                            } else if (swipe > 500) {
                                handleMobilePrev(e);
                            }
                        }}
                    >
                        <InfoCard
                            containerRef={containerRef}
                            title={currentCard.heading}
                            content={currentCard.description}
                            align="center"
                            top="50%"
                            left="50%"
                            rotate="0deg"
                            className="mobile-info-card"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Right Arrow */}
                <button className="mobile-card-arrow right" onClick={handleMobileNext}>
                    ›
                </button>

                {/* Card Indicator */}
                <div className="card-indicators">
                    {cards.map((_, index) => (
                        <button
                            key={index}
                            className={`card-indicator ${index === currentCardIndex ? 'active' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setDirection(index > currentCardIndex ? 1 : -1);
                                setCurrentCardIndex(index);
                            }}
                        />
                    ))}
                </div>
            </div>
        );
    }

    // Desktop View: All Cards
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

