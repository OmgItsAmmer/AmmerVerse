import { useState } from 'react';
import './LandingPage.css';

// Import modular components
import Navbar from '../../components/Navbar.jsx';  // shared component stays same
import Starfield from './components/Starfield';
import AvatarRow from './components/AvatarRow';
import InfoCardsOverlay from './components/InfoCardsOverlay';
import ProjectCardsOverlay from './components/ProjectCardsOverlay';
import ProjectPopup from './components/ProjectPopup';
import MessagePopup from './components/MessagePopup';
import NavigationButtons from './components/NavigationButtons';
// import MobileCardsCarousel from './components/MobileCardsCarousel';

// Main landing page component
export default function LandingPage() {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [viewMode, setViewMode] = useState('default'); // 'default', 'selected', 'projects'
  const [selectedProject, setSelectedProject] = useState(null);
  const [isMessagePopupOpen, setIsMessagePopupOpen] = useState(false);

  //This is the function which uses two reactive variables to determine the state of the application
  const handleAvatarClick = (index) => {
    if (viewMode === 'projects') return;

    if (selectedAvatar === index) {
      setSelectedAvatar(null);
      setViewMode('default');
    } else {
      setSelectedAvatar(index);
      setViewMode('selected');
    }
  };


  const handleShowProjects = (e) => {
    if (e) e.stopPropagation();
    setViewMode('projects');
  };

  const handleGoBack = (e) => {
    if (e) e.stopPropagation();
    setSelectedAvatar(null);
    setViewMode('default');
    setSelectedProject(null);
    setIsMessagePopupOpen(false);
  };

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    if (viewMode === 'projects') {
      setViewMode('selected');
    } else if (viewMode === 'selected') {
      handleGoBack();
    }
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    if (viewMode === 'selected') {
      handleShowProjects();
    } else if (viewMode === 'projects') {
      setIsMessagePopupOpen(true);
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  return (
    <div className="landing-container">
      {/* Navbar */}
      <Navbar />

      {/* Starfield background */}
      <Starfield />

      {/* Avatar Images Row */}
      <AvatarRow
        selectedAvatar={selectedAvatar}
        viewMode={viewMode}
        onAvatarClick={handleAvatarClick}
        onGoBack={handleGoBack}
        onShowProjects={handleShowProjects}
        onMessageClick={() => setIsMessagePopupOpen(true)}
      />

      {/* Info Cards Overlay (Only in Selected Mode) */}
      <InfoCardsOverlay viewMode={viewMode} selectedAvatar={selectedAvatar} />

      {/* Project Cards Overlay (Only in Projects Mode) */}
      <ProjectCardsOverlay
        viewMode={viewMode}
        selectedAvatar={selectedAvatar}
        onProjectClick={handleProjectClick}
      />

      {/* Mobile Cards Carousel (Only in Projects Mode) */}
      {/* <MobileCardsCarousel
        viewMode={viewMode}
        selectedAvatar={selectedAvatar}
        onProjectClick={handleProjectClick}
        onGoBack={handleGoBack}
      /> */}


      {/* Navigation Buttons (Bottom Left) */}
      <NavigationButtons
        viewMode={viewMode}
        onNext={handleNext}
        onPrev={handlePrev}
      />

      {/* Project Popup */}
      {selectedProject && (
        <ProjectPopup
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Message Popup */}
      {isMessagePopupOpen && (
        <MessagePopup
          onClose={() => setIsMessagePopupOpen(false)}
        />
      )}
    </div>
  );
}

