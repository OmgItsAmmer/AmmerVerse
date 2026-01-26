import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProjectCard from '../ProjectCard';
import { PROJECTS } from '../../data/developerModels.js';
import { useIsMobile } from '../../../../hooks/useMediaQuery';
import './ProjectCardsOverlay.css';

// Project Cards Overlay Component
export default function ProjectCardsOverlay({ viewMode, onProjectClick, selectedAvatar }) {
    const containerRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [direction, setDirection] = useState(0);
    const isMobile = useIsMobile();

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
        setDirection(1);
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    // Get the current project (1 project per page)
    const currentProject = filteredProjects[currentPage];

    // Mobile View: Full Screen Single Card
    if (isMobile) {
        return (
            <div className="project-cards-container mobile-project-cards" ref={containerRef}>
                {/* Pagination Arrows */}
                {totalPages > 1 && (
                    <>
                        <button type="button" className="mobile-project-arrow left" onClick={handlePrev}>
                            ‹
                        </button>
                        <button type="button" className="mobile-project-arrow right" onClick={handleNext}>
                            ›
                        </button>
                    </>
                )}

                {/* Single Project Card with Animation */}
                <AnimatePresence mode='wait' initial={false} custom={direction}>
                    {currentProject && (
                        <motion.div
                            key={currentProject.id}
                            custom={direction}
                            variants={{
                                enter: (direction) => ({
                                    x: direction > 0 ? 300 : -300,
                                    opacity: 0,
                                    scale: 0.8,
                                }),
                                center: {
                                    zIndex: 1,
                                    x: 0,
                                    opacity: 1,
                                    scale: 1,
                                },
                                exit: (direction) => ({
                                    zIndex: 0,
                                    x: direction < 0 ? 300 : -300,
                                    opacity: 0,
                                    scale: 0.8,
                                }),
                            }}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: 'spring', stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 },
                                scale: { duration: 0.3 },
                            }}
                            className="mobile-project-wrapper"
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={1}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = Math.abs(offset.x) * velocity.x;
                                if (swipe < -500) {
                                    handleNext();
                                } else if (swipe > 500) {
                                    handlePrev();
                                }
                            }}
                        >
                            <ProjectCard
                                project={currentProject}
                                category={category}
                                onClick={onProjectClick}
                                containerRef={containerRef}
                                top="50%"
                                left="50%"
                                rotate="0deg"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Project Indicators */}
                {totalPages > 1 && (
                    <div className="project-indicators">
                        {filteredProjects.map((_, index) => (
                            <button
                                key={index}
                                className={`project-indicator ${index === currentPage ? 'active' : ''}`}
                                onClick={() => {
                                    setDirection(index > currentPage ? 1 : -1);
                                    setCurrentPage(index);
                                }}
                            />
                        ))}
                    </div>
                )}

                {filteredProjects.length === 0 && (
                    <div className="no-projects-message">
                        <h3>No projects found for this category.</h3>
                    </div>
                )}
            </div>
        );
    }

    // Desktop View: Original behavior with 2 cards
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

    // Get two different images from the project's images array
    const getProjectImages = (project) => {
        if (!project || !project.images || project.images.length === 0) {
            // Fallback to thumbnail if no images array
            return [project?.thumbnail, project?.thumbnail];
        }

        // Use first two images, or repeat first image if only one exists
        const image1 = project.images[0] || project.thumbnail;
        const image2 = project.images.length > 1 ? project.images[1] : project.images[0] || project.thumbnail;

        return [image1, image2];
    };

    const projectImages = currentProject ? getProjectImages(currentProject) : [null, null];

    // Debug logging for desktop cards
    if (!isMobile && currentProject) {
        console.log('[Desktop Cards Debug]', {
            projectName: currentProject.name,
            projectId: currentProject.id,
            category,
            images: projectImages,
            totalProjects: filteredProjects.length,
            currentPage
        });
    }

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

            <AnimatePresence mode='wait' initial={false}>
                {currentProject && (
                    <motion.div
                        key={currentProject.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
                    >
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
                            image={projectImages[0]}
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
                            image={projectImages[1]}
                        />
                    </motion.div>
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

