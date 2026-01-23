import './AvatarImage.css';

// Avatar image component
export default function AvatarImage({ normalSrc, hoverSrc, alt, onClick, isSelected, isOtherSelected, isProjectsView, label }) {
    return (
        <div
            className={`avatar-image-wrapper ${isSelected ? 'selected' : ''} ${isOtherSelected ? 'hidden' : ''} ${isProjectsView ? 'projects-view' : ''}`}
            onClick={onClick}
        >
            <img
                src={isSelected ? hoverSrc : normalSrc}
                alt={alt}
                className="avatar-image"
            />
            <div className="avatar-label">{label}</div>
        </div>
    );
}

