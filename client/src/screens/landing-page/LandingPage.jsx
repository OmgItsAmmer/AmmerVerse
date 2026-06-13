import { useState } from 'react';
import './LandingPage.css';

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

    return (
        <div className="landing-container">
            {/* ─── Fixed ambient layers ────────────────────────────────── */}
            <Starfield />
            <SpaceMaterialsOrbit />

            {/* ─── Sticky nav ──────────────────────────────────────────── */}
            <Navbar />

            {/* ─── Sections ────────────────────────────────────────────── */}
            <HeroSection />

            <section id="my-projects" className="section-my-projects">
                <DomainCarousel onProjectClick={setSelectedProject} />
            </section>

            <StackurnSection onProjectClick={setSelectedProject} />

            <AchievementsSection />

            <ContactSection
                onContactClick={() => setIsMessagePopupOpen(true)}
            />

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
