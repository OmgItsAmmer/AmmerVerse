// Import avatar images
import avatar1Normal from '../../../assets/images/avatar/normal/1_normal.png';
import avatar1Hover from '../../../assets/images/avatar/hovered/1_hover.png';
import avatar2Normal from '../../../assets/images/avatar/normal/2_normal.png';
import avatar2Hover from '../../../assets/images/avatar/hovered/2_hover.png';
import avatar3Normal from '../../../assets/images/avatar/normal/3_normal.png';
import avatar3Hover from '../../../assets/images/avatar/hovered/3_hover.png';

// Desktop project images (first desktop app)
import omgPosDashboard from '../../../assets/images/mobile_dev/projects/OMGx POS/dashboard.png';
import omgPosSales from '../../../assets/images/mobile_dev/projects/OMGx POS/Sales.png';

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
        name: "Crypto Wallet",
        category: "mobile",
        description: "A secure mobile wallet for managing digital assets on the go. Features include multi-currency support, biometric authentication, real-time price tracking, and seamless transaction management.",
        clientReviews: [
            "Smooth animations and rock-solid security. Best mobile experience.",
            "The biometric authentication is seamless and the UI is incredibly intuitive."
        ],
        techStack: {
            frontend: "React Native, TypeScript",
            backend: "Node.js, Express",
            database: "MongoDB, Redis",
            architecture: "Microservices with Web3.js integration"
        },
        duration: "3 Months"
    }),

    new ProjectModel({
        id: 4,
        name: "Social Connect",
        category: "mobile",
        description: "Cross-platform mobile app for connecting with local communities. Features real-time messaging, event discovery, location-based networking, and community forums.",
        clientReviews: [
            "Beautiful UI and seamless performance on both iOS and Android.",
            "The location-based features work flawlessly. Great community engagement."
        ],
        techStack: {
            frontend: "Flutter, Dart",
            backend: "Firebase Cloud Functions",
            database: "Firebase Firestore",
            architecture: "Serverless with real-time sync"
        },
        duration: "4 Months"
    }),

    new ProjectModel({
        id: 7,
        name: "Fitness Tracker",
        category: "mobile",
        description: "AI-powered fitness tracking app with personalized workout plans. Includes activity tracking, nutrition logging, progress analytics, and social challenges.",
        clientReviews: [
            "The AI recommendations are spot on. Great user retention.",
            "Love the social features and the workout plans adapt perfectly to my goals."
        ],
        techStack: {
            frontend: "Swift, SwiftUI",
            backend: "Python, FastAPI",
            database: "PostgreSQL, InfluxDB",
            architecture: "Native iOS with CoreML and HealthKit integration"
        },
        duration: "3 Months"
    }),

    // Web Projects
    new ProjectModel({
        id: 2,
        name: "Sportivex",
        category: "web",
        description: "Comprehensive analytics dashboard for online retailers. Features real-time sales tracking, inventory management, customer insights, and predictive analytics powered by machine learning.",
        clientReviews: [
            "The data visualization is incredible. Helps us make better decisions.",
            "Real-time updates and the predictive analytics have transformed our business."
        ],
        techStack: {
            frontend: "React, D3.js, Material-UI",
            backend: "Node.js, Express, GraphQL",
            database: "PostgreSQL, Redis",
            architecture: "Microservices with event-driven architecture"
        },
        duration: "4 Months"
    }),

    new ProjectModel({
        id: 5,
        name: "3D Portfolio",
        category: "web",
        description: "Immersive 3D web experience showcasing creative work. Features interactive 3D models, smooth animations, particle effects, and responsive design that adapts to any screen size.",
        clientReviews: [
            "Stunning visuals that really capture the user's attention.",
            "The 3D interactions are smooth and the performance is excellent even on mobile."
        ],
        techStack: {
            frontend: "React Three Fiber, Three.js, GSAP",
            backend: "Next.js API Routes",
            database: "Sanity.io CMS",
            architecture: "JAMstack with SSG and ISR"
        },
        duration: "2 Months"
    }),

    new ProjectModel({
        id: 8,
        name: "Travel Blog",
        category: "web",
        description: "Interactive travel blog with map integration. Features location-based stories, photo galleries, trip planning tools, and community recommendations with real-time updates.",
        clientReviews: [
            "Visually stunning and very easy to update content.",
            "The map integration is seamless and the CMS is incredibly user-friendly."
        ],
        techStack: {
            frontend: "Next.js, Mapbox GL, Tailwind CSS",
            backend: "Next.js API Routes, Sanity.io",
            database: "Sanity.io, Cloudinary",
            architecture: "JAMstack with SSR and API routes"
        },
        duration: "2 Months"
    }),

    // Desktop Projects
    new ProjectModel({
        id: 3,
        thumbnail: omgPosSales,
        images: [omgPosSales, omgPosDashboard],
        name: "OMGx POS NEXUS",
        category: "desktop",
        description: "Desktop utility for optimizing system performance and resource usage. Features include memory management, startup optimization, disk cleanup, and real-time performance monitoring.",
        clientReviews: [
            "Blazing fast and very low resource footprint. A must-have tool.",
            "System performance improved dramatically. The interface is clean and intuitive."
        ],
        techStack: {
            frontend: "FLutter Desktop",
            backend: "Dart,Rust",
            database: "Supabase",
            architecture: "Monolithic,MVC"
        },
        duration: "5 Months"
    }),

    new ProjectModel({
        id: 6,
        name: "Game Engine Tool",
        category: "desktop",
        description: "Asset management tool for game developers. Features include asset pipeline automation, version control integration, batch processing, and real-time preview capabilities.",
        clientReviews: [
            "Streamlined our workflow significantly. Very robust.",
            "The batch processing saves us hours every day. Excellent performance with large files."
        ],
        techStack: {
            frontend: "Qt, C++",
            backend: "Python, C++",
            database: "SQLite, File System",
            architecture: "Multi-threaded with plugin system"
        },
        duration: "6 Months"
    }),

    new ProjectModel({
        id: 9,
        name: "File Encryptor",
        category: "desktop",
        description: "Secure file encryption tool for enterprise use. Features military-grade encryption, batch processing, secure key management, and audit logging for compliance.",
        clientReviews: [
            "Simple to use but extremely secure. Exactly what we needed.",
            "The enterprise features and audit logs are perfect for our compliance requirements."
        ],
        techStack: {
            frontend: "C#, WPF",
            backend: ".NET Core, C#",
            database: "SQL Server, Encrypted Storage",
            architecture: "Native Windows with AES-256 encryption"
        },
        duration: "4 Months"
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
                heading: "Mobile Development",
                description: "Crafting native and cross-platform mobile applications that deliver seamless user experiences on iOS and Android. Specializing in Flutter, React Native, and Swift for building high-performance mobile solutions.",
                position: { align: "left", top: "20%", left: "15%", rotate: "-6deg" }
            },
            {
                heading: "Advantages",
                description: "Cross-platform development reduces time-to-market. Hot reload enables rapid iteration. Access to native device features. Strong community support and extensive libraries. Cost-effective for startups and MVPs.",
                position: { align: "left", top: "55%", left: "20%", rotate: "4deg" }
            },
            {
                heading: "Challenges",
                description: "Platform-specific optimizations may be needed. App size can be larger than pure native apps. Performance considerations for complex animations. Keeping up with OS updates and deprecations.",
                position: { align: "right", top: "25%", left: "65%", rotate: "5deg" }
            },
            {
                heading: "Future Outlook",
                description: "Growing demand for mobile-first experiences. Expansion into wearables and IoT devices. Progressive Web Apps bridging mobile and web. AI and ML integration becoming standard in mobile apps.",
                position: { align: "right", top: "60%", left: "60%", rotate: "-3deg" }
            }
        ],
        projectIds: [1, 4, 7]
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
                heading: "Web Development",
                description: "Building modern, responsive web applications with cutting-edge technologies. Expertise in React, Next.js, and Three.js for creating immersive digital experiences that work seamlessly across all devices.",
                position: { align: "left", top: "20%", left: "15%", rotate: "-6deg" }
            },
            {
                heading: "Advantages",
                description: "Universal accessibility across devices. No installation required. Easy updates and deployment. SEO-friendly with proper implementation. Rich ecosystem of frameworks and tools. Cost-effective scaling.",
                position: { align: "left", top: "55%", left: "20%", rotate: "4deg" }
            },
            {
                heading: "Challenges",
                description: "Browser compatibility considerations. Performance optimization for complex UIs. Security vulnerabilities require constant vigilance. Offline functionality limitations. Managing state in large applications.",
                position: { align: "right", top: "25%", left: "65%", rotate: "5deg" }
            },
            {
                heading: "Future Outlook",
                description: "WebAssembly enabling near-native performance. Progressive Web Apps blurring lines with native. AI-powered development tools. Web3 and decentralized applications. Immersive 3D experiences becoming mainstream.",
                position: { align: "right", top: "60%", left: "60%", rotate: "-3deg" }
            }
        ],
        projectIds: [2, 5, 8]
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
                heading: "Desktop Development",
                description: "Creating powerful desktop applications with native performance and system-level access. Specializing in Electron, Qt, and native frameworks for building professional-grade tools and utilities.",
                position: { align: "left", top: "20%", left: "15%", rotate: "-6deg" }
            },
            {
                heading: "Advantages",
                description: "Full system access and native performance. Offline-first capabilities. Better resource management. Advanced file system operations. Integration with OS-level features. Professional tooling support.",
                position: { align: "left", top: "55%", left: "20%", rotate: "4deg" }
            },
            {
                heading: "Challenges",
                description: "Platform-specific builds and testing. Distribution and update management. Larger installation footprint. OS compatibility maintenance. Code signing and security certificates required.",
                position: { align: "right", top: "25%", left: "65%", rotate: "5deg" }
            },
            {
                heading: "Future Outlook",
                description: "Cross-platform frameworks maturing rapidly. Cloud-desktop hybrid applications emerging. AI-powered development assistants. WebAssembly enabling web-to-desktop transitions. Growing demand for specialized tools.",
                position: { align: "right", top: "60%", left: "60%", rotate: "-3deg" }
            }
        ],
        projectIds: [3, 6, 9]
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
