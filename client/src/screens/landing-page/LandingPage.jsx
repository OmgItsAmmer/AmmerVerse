import { useState } from 'react';
import './LandingPage.css';
import SpaceTravelSection from '../../components/SpaceTravelSection/SpaceTravelSection.jsx';
import { useSpaceTravelScroll } from '../../hooks/useSpaceTravelScroll.js';

// Global ambient layers (always present)
import Navbar from '../../components/Navbar.jsx';
import Starfield from './components/Starfield';
import SpaceMaterialsOrbit from './components/SpaceMaterialsOrbit/SpaceMaterialsOrbit';

// Sections
import HeroSection from './components/HeroSection/HeroSection.jsx';
import DomainCarousel from './components/DomainCarousel/DomainCarousel.jsx';
import StackurnSection from './components/StackurnSection/StackurnSection.jsx';
import AchievementsSection from './components/AchievementsSection/AchievementsSection.jsx';
import ContactSection from './components/ContactSection/ContactSection.jsx';

// Shared popups
import ProjectPopup from './components/ProjectPopup';
import MessagePopup from './components/MessagePopup';

export default function LandingPage() {
    const [selectedProject, setSelectedProject] = useState(null);
    const [isMessagePopupOpen, setIsMessagePopupOpen] = useState(false);

    useSpaceTravelScroll();

    return (
        <div className="landing-page">
            {/* Fixed layers — outside perspective so position:fixed stays viewport-locked */}
            <Starfield />
            <SpaceMaterialsOrbit />
            <Navbar />

            <div className="landing-container space-travel-root">
                {/* ─── Sections ────────────────────────────────────────────── */}
                <SpaceTravelSection id="hero">
                    <HeroSection />
                </SpaceTravelSection>

                <SpaceTravelSection id="my-projects" className="section-my-projects">
                    <DomainCarousel onProjectClick={setSelectedProject} />
                </SpaceTravelSection>

                <SpaceTravelSection id="stackurn">
                    <StackurnSection onProjectClick={setSelectedProject} />
                </SpaceTravelSection>

                <SpaceTravelSection id="achievements" blur={false} mode="opacity">
                    <AchievementsSection />
                </SpaceTravelSection>

                <SpaceTravelSection id="contact">
                    <ContactSection
                        onContactClick={() => setIsMessagePopupOpen(true)}
                    />
                </SpaceTravelSection>
            </div>

            {/* ─── Global overlays ─────────────────────────────────────── */}
            {selectedProject && (
                <ProjectPopup
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}

            {isMessagePopupOpen && (
                <MessagePopup
                    onClose={() => setIsMessagePopupOpen(false)}
                />
            )}
        </div>
    );
}
