import React from 'react';
import { useIsMobile } from '../../../../hooks/useMediaQuery';
import './NavigationButtons.css';

// Import icon images
import homeIcon from '../../../../assets/images/icons/home.png';
import projectIcon from '../../../../assets/images/icons/project.png';
import messageIcon from '../../../../assets/images/icons/message.png';
import leftArrowIcon from '../../../../assets/images/icons/left-arrow.png';
import rightArrowIcon from '../../../../assets/images/icons/right-arrow.png';

export default function NavigationButtons({ viewMode, onNext, onPrev }) {
    const isMobile = useIsMobile();

    if (viewMode === 'default') return null;

    const getButtonText = () => {
        if (viewMode === 'selected') {
            return { prev: 'Go Home', next: 'Show Projects' };
        }
        if (viewMode === 'projects') {
            return { prev: 'Go Back', next: 'Leave Message' };
        }
        return { prev: 'Prev', next: 'Next' };
    };

    const getButtonIcons = () => {
        if (viewMode === 'selected') {
            return { prevIcon: homeIcon, nextIcon: projectIcon };
        }
        if (viewMode === 'projects') {
            return { prevIcon: leftArrowIcon, nextIcon: messageIcon };
        }
        return { prevIcon: leftArrowIcon, nextIcon: rightArrowIcon };
    };

    const { prev, next} = getButtonText();
    const { prevIcon, nextIcon } = getButtonIcons();

    return (
        <div className="navigation-buttons-container">
            <button className="nav-btn prev-btn" onClick={onPrev} aria-label={prev}>
                {isMobile ? (
                    <img src={prevIcon} alt={prev} className="nav-icon-img" />
                ) : (
                    <>
                        <img src={prevIcon} alt={prev} className="nav-icon-img nav-arrow-icon" /> {prev}
                    </>
                )}
            </button>
            <button className="nav-btn next-btn" onClick={onNext} aria-label={next}>
                {isMobile ? (
                    <img src={nextIcon} alt={next} className="nav-icon-img" />
                ) : (
                    <>
                        {next} <img src={nextIcon} alt={next} className="nav-icon-img nav-arrow-icon" />
                    </>
                )}
            </button>
        </div>
    );
}

