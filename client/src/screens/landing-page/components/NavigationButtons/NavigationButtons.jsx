import React from 'react';
import { useIsMobile } from '../../../../hooks/useMediaQuery';
import './NavigationButtons.css';

// Import icon images
import homeIcon from '../../../../assets/images/icons/home.png';
import projectIcon from '../../../../assets/images/icons/project.png';
import messageIcon from '../../../../assets/images/icons/message.png';

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
            return { prevIcon: '←', nextIcon: messageIcon };
        }
        return { prevIcon: '←', nextIcon: '→' };
    };

    const { prev, next} = getButtonText();
    const { prevIcon, nextIcon } = getButtonIcons();

    return (
        <div className="navigation-buttons-container">
            <button className="nav-btn prev-btn" onClick={onPrev} aria-label={prev}>
                {isMobile ? (
                    typeof prevIcon === 'string' && prevIcon.length === 1 ? (
                        <span className="nav-icon-text">{prevIcon}</span>
                    ) : (
                        <img src={prevIcon} alt={prev} className="nav-icon-img" />
                    )
                ) : (
                    <>
                        <span className="nav-arrow">←</span> {prev}
                    </>
                )}
            </button>
            <button className="nav-btn next-btn" onClick={onNext} aria-label={next}>
                {isMobile ? (
                    typeof nextIcon === 'string' && nextIcon.length === 1 ? (
                        <span className="nav-icon-text">{nextIcon}</span>
                    ) : (
                        <img src={nextIcon} alt={next} className="nav-icon-img" />
                    )
                ) : (
                    <>
                        {next} <span className="nav-arrow">→</span>
                    </>
                )}
            </button>
        </div>
    );
}

