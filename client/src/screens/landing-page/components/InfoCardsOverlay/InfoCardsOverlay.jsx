import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import InfoCard from '../InfoCard';
import { getDeveloperByIndex } from '../constants';
import { useIsMobile } from '../../../../hooks/useMediaQuery';
import colors from '../../../../utils/colors';
import './InfoCardsOverlay.css';

// Info Cards Overlay Component
export default function InfoCardsOverlay({ viewMode, selectedAvatar }) {
    const containerRef = useRef(null);
    const cardRefs = useRef([]);
    const isMobile = useIsMobile();
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [focusedCardIndex, setFocusedCardIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        setCurrentCardIndex(0);
        setFocusedCardIndex(0);
    }, [selectedAvatar]);

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
            <div
                className="info-cards-container mobile-info-cards"
                ref={containerRef}
                style={{
                    '--indicator-active': colors.ui.cosmicLatte,
                    '--indicator-inactive': `${colors.ui.primaryText}55`,
                    '--indicator-border': `${colors.ui.primaryText}88`,
                }}
            >
                {/* Navigation Arrows */}
                <button className="mobile-card-arrow left" onClick={handleMobilePrev}>
                    ‹
                </button>

                <div className="mobile-card-stack">
                    {/* Single Card with Animation */}
                    <AnimatePresence mode="wait" initial={false} custom={direction}>
                        <Motion.div
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
                        </Motion.div>
                    </AnimatePresence>

                    {/* Pagination dots directly under the card */}
                    {cards.length > 1 && (
                        <div
                            className="info-carousel-indicators info-carousel-indicators--under-card"
                            aria-label="Info card carousel position"
                        >
                            {cards.map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className={`info-carousel-indicator ${index === currentCardIndex ? 'active' : ''}`}
                                    aria-label={`Go to card ${index + 1}`}
                                    aria-current={index === currentCardIndex ? 'true' : undefined}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDirection(index > currentCardIndex ? 1 : -1);
                                        setCurrentCardIndex(index);
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Arrow */}
                <button className="mobile-card-arrow right" onClick={handleMobileNext}>
                    ›
                </button>
            </div>
        );
    }

    // Desktop View: All Cards
    return (
        <div
            className="info-cards-container info-cards-container--desktop"
            ref={containerRef}
            style={{
                '--indicator-active': colors.ui.cosmicLatte,
                '--indicator-inactive': `${colors.ui.primaryText}55`,
                '--indicator-border': `${colors.ui.primaryText}88`,
            }}
        >
            {developer.infoCards.map((card, index) => (
                <InfoCard
                    key={index}
                    ref={(el) => {
                        cardRefs.current[index] = el;
                    }}
                    containerRef={containerRef}
                    title={card.heading}
                    content={card.description}
                    align={card.position.align}
                    top={card.position.top}
                    left={card.position.left}
                    rotate={card.position.rotate}
                    onActivate={() => setFocusedCardIndex(index)}
                    indicatorActive={index === focusedCardIndex}
                />
            ))}
            {cards.length > 1 && (
                <div
                    className="info-carousel-indicators info-carousel-indicators--desktop"
                    aria-label="Info card carousel position"
                >
                    {cards.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            className={`info-carousel-indicator ${index === focusedCardIndex ? 'active' : ''}`}
                            aria-label={`Focus info card ${index + 1}`}
                            aria-current={index === focusedCardIndex ? 'true' : undefined}
                            onClick={(e) => {
                                e.stopPropagation();
                                setFocusedCardIndex(index);
                                const node = cardRefs.current[index];
                                if (node) {
                                    node.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                                }
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

