import { useState } from 'react';
import './AvatarImage.css';

// Avatar image component with hover effect
export default function AvatarImage({ normalSrc, hoverSrc, alt, onClick, isSelected, isOtherSelected, isProjectsView, label }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`avatar-image-wrapper ${isSelected ? 'selected' : ''} ${isOtherSelected ? 'hidden' : ''} ${isProjectsView ? 'projects-view' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <img
                src={isHovered || isSelected ? hoverSrc : normalSrc}
                alt={alt}
                className="avatar-image"
            />
            <div className="avatar-label">{label}</div>
        </div>
    );
}

