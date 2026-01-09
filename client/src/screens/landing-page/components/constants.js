// Import avatar images
import avatar1Normal from '../../../assets/images/avatar/normal/1_normal.png';
import avatar1Hover from '../../../assets/images/avatar/hovered/1_hover.png';
import avatar2Normal from '../../../assets/images/avatar/normal/2_normal.png';
import avatar2Hover from '../../../assets/images/avatar/hovered/2_hover.png';
import avatar3Normal from '../../../assets/images/avatar/normal/3_normal.png';
import avatar3Hover from '../../../assets/images/avatar/hovered/3_hover.png';


// Avatar images export
export const AVATAR_IMAGES = {
    avatar1: { normal: avatar1Normal, hover: avatar1Hover },
    avatar2: { normal: avatar2Normal, hover: avatar2Hover },
    avatar3: { normal: avatar3Normal, hover: avatar3Hover }
};

// Re-export developer models for easy access
export { DEVELOPERS, PROJECTS, getDeveloperByIndex, getAllProjects, getProjectsByCategory } from '../data/developerModels';
