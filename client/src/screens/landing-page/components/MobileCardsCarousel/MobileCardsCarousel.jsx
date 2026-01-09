// import { useState } from 'react';
// import ProjectCard from '../ProjectCard';
// import { getDeveloperByIndex } from '../constants';
// import './MobileCardsCarousel.css';

// // Mobile Cards Carousel Component
// export default function MobileCardsCarousel({ viewMode, onProjectClick, onGoBack, selectedAvatar }) {
//     const [projectPage, setProjectPage] = useState(0);
//     const [slideDirection, setSlideDirection] = useState('in-right');
//     const [isAnimating, setIsAnimating] = useState(false);

//     // Get the selected developer's projects
//     const developer = getDeveloperByIndex(selectedAvatar);
//     const projects = developer ? developer.projects : [];
//     const totalPages = projects.length;

//     const handleNextPage = () => {
//         if (isAnimating) return;
//         setIsAnimating(true);
//         setSlideDirection('out-left');

//         setTimeout(() => {
//             setProjectPage((prev) => (prev + 1) % totalPages);
//             setSlideDirection('in-right');
//             setIsAnimating(false);
//         }, 500); // Match CSS animation duration
//     };

//     const handlePrevPage = () => {
//         if (isAnimating) return;
//         setIsAnimating(true);
//         setSlideDirection('out-right');

//         setTimeout(() => {
//             setProjectPage((prev) => (prev - 1 + totalPages) % totalPages);
//             setSlideDirection('in-left');
//             setIsAnimating(false);
//         }, 500);
//     };

//     const currentProject = projects[projectPage];

//     if (viewMode !== 'projects') return null;
//     if (!currentProject) return null;

//     return (
//         <div className="mobile-cards-container">
//             {/* Left Arrow */}
//             <button className="carousel-arrow left" onClick={handlePrevPage}>
//                 ‹
//             </button>

//             {/* Cards */}
//             <div className="mobile-cards-wrapper">
//                 {/* Show two cards for the same project with different tilts */}
//                 <ProjectCard
//                     key={`${currentProject.id}-left`}
//                     project={currentProject}
//                     onClick={onProjectClick}
//                     animationClass={`slide-${slideDirection}`}
//                     tilt="left"
//                 />
//                 <ProjectCard
//                     key={`${currentProject.id}-right`}
//                     project={currentProject}
//                     onClick={onProjectClick}
//                     animationClass={`slide-${slideDirection}`}
//                     tilt="right"
//                 />
//             </div>

//             {/* Right Arrow */}
//             <button className="carousel-arrow right" onClick={handleNextPage}>
//                 ›
//             </button>

//             <button className="back-to-home-btn" onClick={onGoBack}>
//                 ← Back to Home
//             </button>
//         </div>
//     );
// }

