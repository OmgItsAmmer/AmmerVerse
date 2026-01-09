import AvatarImage from '../AvatarImage';
import { DEVELOPERS } from '../constants';
import './AvatarRow.css';

// Avatar Row Component
export default function AvatarRow({ selectedAvatar, viewMode, onAvatarClick, onGoBack, onShowProjects, onMessageClick }) {
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

