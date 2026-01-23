import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AvatarImage from '../AvatarImage';
import { DEVELOPERS } from '../constants';
import { useIsMobile } from '../../../../hooks/useMediaQuery';
import './AvatarRow.css';

// Avatar Row Component
export default function AvatarRow({ selectedAvatar, viewMode, onAvatarClick, onGoBack, onShowProjects, onMessageClick, currentMobileAvatar, onMobileAvatarChange }) {
    const isMobile = useIsMobile();
    const [direction, setDirection] = useState(0);

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

    // Mobile View: Single Avatar with Navigation
    if (isMobile && viewMode === 'default') {
        // If currentMobileAvatar is null, return null temporarily (will be set in useEffect)
        if (currentMobileAvatar === null) {
            return null;
        }
        
        const currentDeveloper = DEVELOPERS[currentMobileAvatar];
        
        return (
            <div className="avatar-row mobile-avatar-row">
                {/* Left Arrow */}
                <button className="mobile-avatar-arrow left" onClick={handleMobilePrev}>
                    ‹
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
                    >
                        <AvatarImage
                            normalSrc={currentDeveloper.avatarImages.normal}
                            hoverSrc={currentDeveloper.avatarImages.hover}
                            alt={currentDeveloper.name}
                            onClick={() => onAvatarClick(currentMobileAvatar)}
                            isSelected={false}
                            isOtherSelected={false}
                            isProjectsView={false}
                            label={currentDeveloper.name}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Right Arrow */}
                <button className="mobile-avatar-arrow right" onClick={handleMobileNext}>
                    ›
                </button>
            </div>
        );
    }

    // Mobile View: Selected or Projects Mode (hide avatar row completely in projects mode)
    if (isMobile && viewMode === 'projects') {
        return null;
    }

    // Mobile View: Selected Mode (show selected avatar only)
    if (isMobile && viewMode === 'selected') {
        const currentDeveloper = DEVELOPERS[selectedAvatar];
        return (
            <div className="avatar-row mobile-avatar-selected">
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
            </div>
        );
    }

    // Desktop View: Original behavior
    return (
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

