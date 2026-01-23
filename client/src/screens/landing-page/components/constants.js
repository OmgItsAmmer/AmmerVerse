// Import avatar images
import avatar1Normal from '../../../assets/images/avatar/normal/1_normal.png';
import avatar1Hover from '../../../assets/images/avatar/hovered/1_hover.png';
import avatar2Normal from '../../../assets/images/avatar/normal/2_normal.png';
import avatar2Hover from '../../../assets/images/avatar/hovered/2_hover.png';
import avatar3Normal from '../../../assets/images/avatar/normal/3_normal.png';
import avatar3Hover from '../../../assets/images/avatar/hovered/3_hover.png';

// Desktop project images
import omgxPosDesktop1 from '../../../assets/images/desktop_dev/projects/OMGx POS/1.png';
import omgxPosDesktop2 from '../../../assets/images/desktop_dev/projects/OMGx POS/2.png';

// Mobile project images
import kksOnline1 from '../../../assets/images/mobile_dev/projects/kks_online/1.jpg';
import kksOnline2 from '../../../assets/images/mobile_dev/projects/kks_online/2.jpg';

// Web project images
import fashionOracle1 from '../../../assets/images/web_dev/projects/fashion_oracle/1.png';
import fashionOracle2 from '../../../assets/images/web_dev/projects/fashion_oracle/2.png';
import fashionOracle3 from '../../../assets/images/web_dev/projects/fashion_oracle/3.png';
import fashionOracle4 from '../../../assets/images/web_dev/projects/fashion_oracle/4.png';

// Avatar images export
export const AVATAR_IMAGES = {
    avatar1: { normal: avatar1Normal, hover: avatar1Hover },
    avatar2: { normal: avatar2Normal, hover: avatar2Hover },
    avatar3: { normal: avatar3Normal, hover: avatar3Hover }
};

// Project images export
export const PROJECT_IMAGES = {
    desktop: {
        omgxPos: [omgxPosDesktop1, omgxPosDesktop2]
    },
    mobile: {
        kksOnline: [kksOnline1, kksOnline2]
    },
    web: {
        fashionOracle: [fashionOracle1, fashionOracle2, fashionOracle3, fashionOracle4]
    }
};

// Re-export developer models for easy access
export { DEVELOPERS, PROJECTS, getDeveloperByIndex, getAllProjects, getProjectsByCategory } from '../data/developerModels';
