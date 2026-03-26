import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AvatarImage from '../AvatarImage';
import { DEVELOPERS } from '../constants';
import { useIsMobile } from '../../../../hooks/useMediaQuery';
import colors from '../../../../utils/colors';
import './AvatarRow.css';

import leftArrowIcon from '../../../../assets/images/icons/left-arrow.png';
import rightArrowIcon from '../../../../assets/images/icons/right-arrow.png';

// Avatar Row Component
export default function AvatarRow({ selectedAvatar, viewMode, onAvatarClick, onGoBack, onShowProjects, onMessageClick, currentMobileAvatar, onMobileAvatarChange }) {
    const isMobile = useIsMobile();
    const [direction, setDirection] = useState(0);
    const preloadContainerRef = useRef(null);
    const didSwipeRef = useRef(false);

    // Preload all hover images on component mount and keep them cached
    useEffect(() => {
        // Function to preload a single image and wait for it to load
        const preloadImage = (src) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });
        };

        // Preload all hover images and wait for them to fully load
        const preloadAllHoverImages = async () => {
            try {
                const preloadPromises = DEVELOPERS.map((developer) => {
                    if (developer.avatarImages?.hover) {
                        return preloadImage(developer.avatarImages.hover);
                    }
                    return Promise.resolve(null);
                }).filter(Boolean);

                await Promise.all(preloadPromises);
                
                // After images are loaded, add them to DOM as hidden elements for persistent caching
                if (preloadContainerRef.current) {
                    DEVELOPERS.forEach((developer) => {
                        if (developer.avatarImages?.hover) {
                            const hiddenImg = document.createElement('img');
                            hiddenImg.src = developer.avatarImages.hover;
                            hiddenImg.style.display = 'none';
                            hiddenImg.style.position = 'absolute';
                            hiddenImg.style.visibility = 'hidden';
                            hiddenImg.style.width = '0';
                            hiddenImg.style.height = '0';
                            hiddenImg.setAttribute('aria-hidden', 'true');
                            preloadContainerRef.current.appendChild(hiddenImg);
                        }
                    });
                }
            } catch (error) {
                console.warn('Error preloading avatar hover images:', error);
            }
        };

        preloadAllHoverImages();
    }, []);

    // Removed useEffect - mobile avatar is now initialized in parent component

    const handleMobileNext = (e) => {
        e.stopPropagation();
        setDirection(1);
        const nextIndex = (currentMobileAvatar + 1) % DEVELOPERS.length;
        onMobileAvatarChange(nextIndex);
    };

    const handleMobilePrev = (e) => {
        e.stopPropagation();
        setDirection(-1);
        const prevIndex = (currentMobileAvatar - 1 + DEVELOPERS.length) % DEVELOPERS.length;
        onMobileAvatarChange(prevIndex);
    };

    // Render preload container wrapper
    const renderWithPreload = (content) => (
        <>
            {/* Hidden container for preloaded hover images to keep them cached */}
            <div 
                ref={preloadContainerRef}
                style={{
                    position: 'absolute',
                    visibility: 'hidden',
                    width: 0,
                    height: 0,
                    overflow: 'hidden',
                    pointerEvents: 'none'
                }}
                aria-hidden="true"
            />
            {content}
        </>
    );

    // Mobile View: Single Avatar with Navigation
    if (isMobile && viewMode === 'default') {
        // If currentMobileAvatar is null, return null temporarily (will be set in useEffect)
        if (currentMobileAvatar === null) {
            return renderWithPreload(null);
        }
        
        const currentDeveloper = DEVELOPERS[currentMobileAvatar];
        
        return renderWithPreload(
            <div
                className="avatar-row mobile-avatar-row"
                style={{
                    '--indicator-active': colors.ui.glowPurple,
                    '--indicator-inactive': `${colors.ui.primaryText}55`,
                    '--indicator-border': `${colors.ui.primaryText}88`,
                }}
            >
                {/* Left Arrow */}
                <button className="mobile-avatar-arrow left" onClick={handleMobilePrev} type="button" aria-label="Previous avatar">
                    <img className="mobile-avatar-arrow-img" src={leftArrowIcon} alt="" aria-hidden="true" />
                </button>

                {/* Single Avatar with Animation */}
                <AnimatePresence mode="wait" initial={false} custom={direction}>
                    <motion.div
                        key={currentMobileAvatar}
                        custom={direction}
                        variants={{
                            enter: (direction) => ({
                                x: direction > 0 ? 100 : -100,
                                opacity: 0,
                            }),
                            center: {
                                zIndex: 1,
                                x: 0,
                                opacity: 1,
                            },
                            exit: (direction) => ({
                                zIndex: 0,
                                x: direction < 0 ? 100 : -100,
                                opacity: 0,
                            }),
                        }}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: 'spring', stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                        }}
                        className="mobile-avatar-wrapper"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragStart={() => {
                            didSwipeRef.current = false;
                        }}
                        onDragEnd={(e, { offset }) => {
                            const deltaX = offset.x;
                            const absX = Math.abs(deltaX);

                            // Treat a meaningful horizontal swipe as "next/prev".
                            // Negative deltaX = swipe left -> next avatar.
                            if (absX > 70) {
                                didSwipeRef.current = true;
                                if (deltaX < 0) handleMobileNext(e);
                                else handleMobilePrev(e);
                                // Clear the swipe flag shortly after navigation so future taps work normally.
                                setTimeout(() => {
                                    didSwipeRef.current = false;
                                }, 250);
                            } else {
                                didSwipeRef.current = false;
                            }
                        }}
                    >
                        <AvatarImage
                            normalSrc={currentDeveloper.avatarImages.normal}
                            hoverSrc={currentDeveloper.avatarImages.hover}
                            alt={currentDeveloper.name}
                            onClick={() => {
                                // Prevent a tap from firing after a swipe navigation.
                                if (didSwipeRef.current) {
                                    didSwipeRef.current = false;
                                    return;
                                }
                                onAvatarClick(currentMobileAvatar);
                            }}
                            isSelected={false}
                            isOtherSelected={false}
                            isProjectsView={false}
                            label={currentDeveloper.name}
                            showHoverImage
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Right Arrow */}
                <button className="mobile-avatar-arrow right" onClick={handleMobileNext} type="button" aria-label="Next avatar">
                    <img className="mobile-avatar-arrow-img" src={rightArrowIcon} alt="" aria-hidden="true" />
                </button>

                {/* Carousel Indicator */}
                <div className="avatar-indicators" aria-label="Avatar carousel position">
                    {DEVELOPERS.map((dev, index) => (
                        <button
                            key={dev.id ?? index}
                            type="button"
                            className={`avatar-indicator ${index === currentMobileAvatar ? 'active' : ''}`}
                            aria-label={`Go to avatar ${index + 1}`}
                            aria-current={index === currentMobileAvatar ? 'true' : undefined}
                            onClick={(e) => {
                                e.stopPropagation();
                                setDirection(index > currentMobileAvatar ? 1 : -1);
                                onMobileAvatarChange(index);
                            }}
                        />
                    ))}
                </div>
            </div>
        );
    }

    // Mobile View: Selected or Projects Mode (hide avatar row completely in projects mode)
    if (isMobile && viewMode === 'projects') {
        return renderWithPreload(null);
    }

    // Mobile View: Selected Mode (show selected avatar only)
    if (isMobile && viewMode === 'selected') {
        const currentDeveloper = DEVELOPERS[selectedAvatar];
        return renderWithPreload(
            <div className="avatar-row mobile-avatar-selected">
                <motion.div
                    initial={{ opacity: 0, y: 18, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                >
                    <AvatarImage
                        normalSrc={currentDeveloper.avatarImages.normal}
                        hoverSrc={currentDeveloper.avatarImages.hover}
                        alt={currentDeveloper.name}
                        onClick={() => onAvatarClick(selectedAvatar)}
                        isSelected={true}
                        isOtherSelected={false}
                        isProjectsView={false}
                        label={currentDeveloper.name}
                    />
                </motion.div>
            </div>
        );
    }

    // Desktop View: Original behavior
    return renderWithPreload(
        <div className={`avatar-row ${selectedAvatar !== null ? 'has-selection' : ''} ${viewMode === 'projects' ? 'projects-mode' : ''}`}>
            {/* Dynamically render avatars from DEVELOPERS array */}
            {DEVELOPERS.map((developer, index) => (
                <AvatarImage
                    key={developer.id}
                    normalSrc={developer.avatarImages.normal}
                    hoverSrc={developer.avatarImages.hover}
                    alt={developer.name}
                    onClick={() => onAvatarClick(index)}
                    isSelected={selectedAvatar === index}
                    isOtherSelected={selectedAvatar !== null && selectedAvatar !== index}
                    isProjectsView={viewMode === 'projects' && selectedAvatar === index}
                    label={developer.name}
                />
            ))}
        </div>
    );
}

