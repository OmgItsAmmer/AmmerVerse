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
import omgxPosMobile1 from '../../../assets/images/mobile_dev/projects/OMGx POS/1.png';
import omgxPosMobile2 from '../../../assets/images/mobile_dev/projects/OMGx POS/2.png';
import omgxPosMobile3 from '../../../assets/images/mobile_dev/projects/OMGx POS/3.png';

// Web project images
import fashionOracle1 from '../../../assets/images/web_dev/projects/fashion_oracle/1.png';
import fashionOracle2 from '../../../assets/images/web_dev/projects/fashion_oracle/2.png';
import fashionOracle3 from '../../../assets/images/web_dev/projects/fashion_oracle/3.png';
import fashionOracle4 from '../../../assets/images/web_dev/projects/fashion_oracle/4.png';
import epiGraph1 from '../../../assets/images/web_dev/projects/EpiGraph/1.png';
import epiGraph2 from '../../../assets/images/web_dev/projects/EpiGraph/2.png';
import videoStreamer1 from '../../../assets/images/web_dev/projects/video_streamer/1.png';
import videoStreamer2 from '../../../assets/images/web_dev/projects/video_streamer/2.png';
import sportivex1 from '../../../assets/images/web_dev/projects/sportivex/1.png';
import sportivex2 from '../../../assets/images/web_dev/projects/sportivex/2.png';
import sportivex3 from '../../../assets/images/web_dev/projects/sportivex/3.png';
import sportivex4 from '../../../assets/images/web_dev/projects/sportivex/4.png';
import sportivex5 from '../../../assets/images/web_dev/projects/sportivex/5.png';
import sportivex6 from '../../../assets/images/web_dev/projects/sportivex/6.png';
import sportivex7 from '../../../assets/images/web_dev/projects/sportivex/7.png';
import sportivex8 from '../../../assets/images/web_dev/projects/sportivex/8.png';

/**
 * Project Model Class
 * Creates consistent project instances with all required fields
 */
class ProjectModel {
    constructor({
        id,
        name,
        category,
        description,
        thumbnail = "",
        images = [],
        clientReviews = [],
        techStack = {},
        duration,
        link = "#",
        github = "",
        youtube = "",
        extraLink = ""
    }) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.description = description;
        this.thumbnail = thumbnail;
        this.images = images;
        this.clientReviews = clientReviews;
        this.techStack = {
            frontend: techStack.frontend || "",
            backend: techStack.backend || "",
            database: techStack.database || "",
            architecture: techStack.architecture || ""
        };
        this.duration = duration;
        this.link = link;
        this.github = github;
        this.youtube = youtube;
        this.extraLink = extraLink;
    }
}

/**
 * Project Instances
 * All projects created using the ProjectModel class
 */
export const PROJECTS = [
    // Mobile Projects
    new ProjectModel({
        id: 1,
        name: "KKs Online",
        category: "mobile",
        thumbnail: kksOnline1,
        images: [kksOnline1, kksOnline2],
        description: "Developed full-stack e-commerce application with mobile app and admin dashboard. Integrated Google OAuth for secure authentication. Built order tracking system with FCM notifications and integrated POS for stock concurrency. Implemented product management, reporting, and analytics dashboard.",
        clientReviews: [
            "The admin dashboard is incredibly powerful and the mobile app is lightning fast.",
            "Stock management and order tracking work flawlessly. The FCM notifications are perfect."
        ],
        techStack: {
            frontend: "Flutter Mobile & Desktop",
            backend: "Rust, Supabase Edge Functions",
            database: "Supabase",
            architecture: "Full-stack with Google OAuth integration"
        },
        duration: "July 2024 – June 2025"
        
    }),

    new ProjectModel({
        id: 7,
        name: "OMGx POS",
        category: "mobile",
        thumbnail: omgxPosMobile1,
        images: [omgxPosMobile1, omgxPosMobile2, omgxPosMobile3],
        description: "Mobile POS application for daily and installment-based sales. Implemented customer, vendor, and salesman management modules. Built comprehensive reporting system and order tracking with installment state logging. Developed fully customizable store settings and complete authentication system.",
        clientReviews: [
            "The mobile POS app is intuitive and handles installments perfectly.",
            "Reporting features are comprehensive and the UI is user-friendly."
        ],
        techStack: {
            frontend: "Flutter Mobile",
            backend: "Dart",
            database: "Supabase",
            architecture: "Mobile-first POS with Supabase integration"
        },
        duration: "March – August 2024"
    }),

    // Web Projects
    new ProjectModel({
        id: 2,
        name: "Sportivex",
        category: "web",
        thumbnail: sportivex1,
        images: [sportivex1, sportivex2, sportivex3, sportivex4, sportivex5, sportivex6, sportivex7, sportivex8],
        description: "Developed a comprehensive sports management system for NUST University. Implemented features for swimming, gym, horse riding, and badminton facilities. Built membership management, renewal system, and real-time QR code attendance tracking. Integrated Stripe payment processing for seamless transactions.",
        clientReviews: [
            "The QR code attendance system has streamlined our operations significantly.",
            "Stripe integration works perfectly and the membership management is intuitive."
        ],
        techStack: {
            frontend: "React",
            backend: "Express",
            database: "Supabase",
            architecture: "Monolithic with Stripe integration"
        },
        duration: "September – December 2024"
    }),

    new ProjectModel({
        id: 3,
        name: "Video Streaming Platform",
        category: "web",
        thumbnail: videoStreamer1,
        images: [videoStreamer1, videoStreamer2],
        description: "Built a cloud-native video streaming platform using microservices architecture deployed on Google Kubernetes Engine (GKE). Implemented 6 independent microservices with Docker containerization and Kubernetes orchestration. Leveraged Google Cloud Storage for video file storage with storage quota management (50MB per user) and daily bandwidth monitoring (100MB per day). Implemented JWT-based authentication, comprehensive logging system, and auto-scaling capabilities. Utilized ClusterIP and LoadBalancer services for secure internal communication and external access.",
        clientReviews: [
            "The Kubernetes deployment on GKE provides excellent scalability and fault tolerance.",
            "Microservices architecture with Google Cloud integration delivers robust performance and reliability."
        ],
        techStack: {
            frontend: "React",
            backend: "Flask (Python)",
            database: "MongoDB",
            architecture: "Microservices on Google Kubernetes Engine (GKE) with Google Cloud Storage"
        },
        duration: "November – December 2024",
        github: "https://github.com/OmgItsAmmer/video_streaming_webapp"
    }),

    new ProjectModel({
        id: 4,
        name: "Fashion Oracle",
        category: "web",
        thumbnail: fashionOracle1,
        images: [fashionOracle1, fashionOracle2, fashionOracle3, fashionOracle4],
        description: "Built an algorithm-rich search engine inspired by Google's early architecture. Implemented tokenization, lemmatization, forward/inverted indexing, and barrel splitting. Processed and indexed 50,000+ fashion images from a 25GB dataset.",
        clientReviews: [
            "The search algorithm is incredibly fast and accurate. Impressive indexing system.",
            "Processing 50,000+ images with such precision is remarkable. Great architecture."
        ],
        techStack: {
            frontend: "HTML, CSS",
            backend: "Flask",
            database: "File System Indexing",
            architecture: "Search engine with inverted indexing"
        },
        duration: "October – December 2023"
    }),

    new ProjectModel({
        id: 5,
        name: "EpiGraph",
        category: "web",
        thumbnail: epiGraph1,
        images: [epiGraph1, epiGraph2],
        description: "Developed simulation algorithm for disease spread modeling with adjustable parameters. Implemented synthetic network generation using Barabási–Albert, Watts–Strogatz, Erdős–Rényi, and community-based models.",
        clientReviews: [
            "The simulation models are sophisticated and the visualizations are excellent.",
            "Network generation algorithms work perfectly for our research needs."
        ],
        techStack: {
            frontend: "React, JavaScript",
            backend: "JavaScript",
            database: "Local Database",
            architecture: "Simulation with graph algorithms"
        },
        duration: "March – April 2024",
        link: "https://v0-epi-graph-disease-spread-simulator.vercel.app/"
    }),

    // Desktop Projects
    new ProjectModel({
        id: 6,
        name: "OMGx POS",
        category: "desktop",
        thumbnail: omgxPosDesktop1,
        images: [omgxPosDesktop1, omgxPosDesktop2],
        description: "Designed industry-standard POS software for daily and installment-based sales. Implemented customer, vendor, and salesman management modules. Built comprehensive reporting system and order tracking with installment state logging. Developed fully customizable store settings and complete authentication system.",
        clientReviews: [
            "The installment tracking system is exactly what we needed. Very robust.",
            "Reporting and order management features are comprehensive. Great authentication system."
        ],
        techStack: {
            frontend: "Flutter Desktop",
            backend: "Dart",
            database: "Supabase",
            architecture: "Supabase Edge Functions"
        },
        duration: "March – August 2024"
    })
];

/**
 * Developer Data Models
 * 
 * Each developer model contains:
 * - id: Unique identifier
 * - name: Developer type name
 * - category: Category identifier for filtering
 * - avatarImages: Normal and hover state images
 * - infoCards: Array of 4 information cards with positioning
 * - projectIds: Array of project IDs that belong to this developer
 */
export const DEVELOPERS = [
    // Mobile Developer
    {
        id: 0,
        name: "Mobile Dev",
        category: "mobile",
        avatarImages: {
            normal: avatar2Normal,
            hover: avatar2Hover
        },
        infoCards: [
            {
                heading: "Tech Stack",
                description: "Flutter\nRust",
                position: { align: "left", top: "20%", left: "15%", rotate: "-6deg" }
            },
            {
                heading: "What I Build",
                description: "E-commerce apps\nChat applications\nPocket POS systems",
                position: { align: "left", top: "55%", left: "20%", rotate: "4deg" }
            },
            {
                heading: "Engineering Approach",
                description: "Clean architecture\nRESTful API integration\nState management\nReusable UI components\nPerformance tuning\nError handling & validation",
                position: { align: "right", top: "25%", left: "65%", rotate: "5deg" }
            },
            {
                heading: "Proof of Work",
                description: "GitHub repositories\nLive demos\nApp features shipped\nAPI integrations",
                position: { align: "right", top: "60%", left: "60%", rotate: "-3deg" }
            }
        ],
        projectIds: [1, 7]
    },

    // Web Developer
    {
        id: 1,
        name: "Web Dev",
        category: "web",
        avatarImages: {
            normal: avatar1Normal,
            hover: avatar1Hover
        },
        infoCards: [
            {
                heading: "Tech Stack",
                description: "MERN Stack (MongoDB, Express, React, Node)\nNext.js",
                position: { align: "left", top: "20%", left: "15%", rotate: "-6deg" }
            },
            {
                heading: "What I Build",
                description: "Investment-based POS software\nE-commerce platforms\nKiosk systems\nAuthentication systems",
                position: { align: "left", top: "55%", left: "20%", rotate: "4deg" }
            },
            {
                heading: "Engineering Approach",
                description: "Clean architecture\nRESTful API design\nState management\nComponent reusability\nPerformance optimization\nError handling & validation",
                position: { align: "right", top: "25%", left: "65%", rotate: "5deg" }
            },
            {
                heading: "Proof of Work",
                description: "GitHub repositories\nLive demos\nActive code commits\nFeatures implemented",
                position: { align: "right", top: "60%", left: "60%", rotate: "-3deg" }
            }
        ],
        projectIds: [2, 3, 4, 5]
    },

    // Desktop Developer
    {
        id: 2,
        name: "Desktop Dev",
        category: "desktop",
        avatarImages: {
            normal: avatar3Normal,
            hover: avatar3Hover
        },
        infoCards: [
            {
                heading: "Tech Stack",
                description: "C#\nFlutter Desktop\nRust",
                position: { align: "left", top: "20%", left: "15%", rotate: "-6deg" }
            },
            {
                heading: "What I Build",
                description: "Business tools\nPOS systems\nCross-platform desktop apps",
                position: { align: "left", top: "55%", left: "20%", rotate: "4deg" }
            },
            {
                heading: "Engineering Approach",
                description: "Clean architecture\nModular system design\nState management\nComponent reusability\nPerformance optimization\nError handling & validation",
                position: { align: "right", top: "25%", left: "65%", rotate: "5deg" }
            },
            {
                heading: "Proof of Work",
                description: "GitHub repositories\nLive desktop builds\nCore features implemented\nOngoing development activity",
                position: { align: "right", top: "60%", left: "60%", rotate: "-3deg" }
            }
        ],
        projectIds: [6]
    }
];

/**
 * Get developer model by avatar index
 * @param {number} index - Avatar index (0, 1, or 2)
 * @returns {object|null} Developer model or null if not found
 */
export function getDeveloperByIndex(index) {
    const developer = DEVELOPERS.find(dev => dev.id === index);
    if (!developer) return null;

    // Return developer with resolved projects instead of projectIds
    return {
        ...developer,
        projects: developer.projectIds.map(id => PROJECTS.find(p => p.id === id)).filter(Boolean)
    };
}

/**
 * Get all projects across all developers
 * @returns {array} Array of all projects
 */
export function getAllProjects() {
    return PROJECTS;
}

/**
 * Get projects by category
 * @param {string} category - Category name ('mobile', 'web', 'desktop')
 * @returns {array} Array of projects in the category
 */
export function getProjectsByCategory(category) {
    return PROJECTS.filter(project => project.category === category);
}
