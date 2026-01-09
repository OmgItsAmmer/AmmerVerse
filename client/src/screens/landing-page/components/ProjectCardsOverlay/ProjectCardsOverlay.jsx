import { useRef, useState } from 'react';
import ProjectCard from '../ProjectCard';
import { PROJECTS } from '../constants.js';
import { AnimatePresence } from 'framer-motion';
import './ProjectCardsOverlay.css';

// Project Cards Overlay Component
export default function ProjectCardsOverlay({ viewMode, onProjectClick, selectedAvatar }) {
    const containerRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(0);

    if (viewMode !== 'projects') return null;

    // Filter projects based on selected avatar
    let category = 'other';
    if (selectedAvatar === 0) category = 'mobile';
    else if (selectedAvatar === 1) category = 'web';
    else if (selectedAvatar === 2) category = 'desktop';

    const filteredProjects = PROJECTS.filter(p => p.category === category);
    
    // 1 project per page (not 2)
    const totalPages = filteredProjects.length;

    const handleNext = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const handlePrev = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    // Get the current project (1 project per page)
    const currentProject = filteredProjects[currentPage];

    // Define positions for 2 screens based on category
    const getPositions = (category) => {
        if (category === 'mobile') {
            // Side by side layout for phone cards, centered more between prev/next buttons
            return [
                { top: '30%', left: '50%', rotate: '-4deg' },
                { top: '30%', left: '70%', rotate: '4deg' }
            ];
        } else {
            // Stacked layout for web and desktop (keep as is)
            return [
                { top: '10%', left: '60%', rotate: '-2deg' },
                { top: '55%', left: '55%', rotate: '2deg' }
            ];
        }
    };

    const positions = getPositions(category);

    return (
        <div className="project-cards-container" ref={containerRef}>
            {/* Pagination Arrows */}
            {totalPages > 1 && (
                <>
                    <button type="button" className="project-pagination-arrow left" onClick={handlePrev}>
                        ‹
                    </button>
                    <button type="button" className="project-pagination-arrow right" onClick={handleNext}>
                        ›
                    </button>
                </>
            )}

            <AnimatePresence mode='wait'>
                {currentProject && (
                    <>
                        {/* Screen 1 */}
                        <ProjectCard
                            key={`${currentProject.id}-screen-1`}
                            project={currentProject}
                            category={category}
                            onClick={onProjectClick}
                            containerRef={containerRef}
                            top={positions[0].top}
                            left={positions[0].left}
                            rotate={positions[0].rotate}
                        />
                        {/* Screen 2 */}
                        <ProjectCard
                            key={`${currentProject.id}-screen-2`}
                            project={currentProject}
                            category={category}
                            onClick={onProjectClick}
                            containerRef={containerRef}
                            top={positions[1].top}
                            left={positions[1].left}
                            rotate={positions[1].rotate}
                        />
                    </>
                )}
            </AnimatePresence>

            {filteredProjects.length === 0 && (
                <div className="no-projects-message">
                    <h3>No projects found for this category.</h3>
                </div>
            )}
        </div>
    );
}

