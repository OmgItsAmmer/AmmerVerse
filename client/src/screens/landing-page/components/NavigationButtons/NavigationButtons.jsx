import React from 'react';
import './NavigationButtons.css';

export default function NavigationButtons({ viewMode, onNext, onPrev }) {
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

    const { prev, next } = getButtonText();

    return (
        <div className="navigation-buttons-container">
            <button className="nav-btn prev-btn" onClick={onPrev}>
                <span className="nav-arrow">←</span> {prev}
            </button>
            <button className="nav-btn next-btn" onClick={onNext}>
                {next} <span className="nav-arrow">→</span>
            </button>
        </div>
    );
}

