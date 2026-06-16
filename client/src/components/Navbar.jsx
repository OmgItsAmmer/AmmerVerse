import { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import cvPdf from '../assets/Docs/cv.pdf';
import mobileDevResumePdf from '../assets/Docs/mobile_dev_resume.pdf';
import webResumePdf from '../assets/Docs/web_resume.pdf';
import aiResumePdf from '../assets/Docs/AI_resume.pdf';
import downloadPdfIcon from '../assets/images/icons/download-pdf.png';
import MessagePopup from '../screens/landing-page/components/MessagePopup';

import { computeScrollDuration } from '../utils/spaceTravel';

function smoothScrollTo(id) {
    const el = document.getElementById(id);
    if (!el) return;
    if (window.__lenis) {
        const offset =
            id === 'achievements'
                ? -(window.innerHeight - el.offsetHeight) / 2
                : -72;
        const current = window.__lenis.scroll;
        const target = el.offsetTop + offset;
        const duration = computeScrollDuration(current, target, window.innerHeight);
        window.__lenis.scrollTo(el, { offset, duration });
    } else {
        el.scrollIntoView({
            behavior: 'smooth',
            block: id === 'achievements' ? 'center' : 'start',
        });
    }
}

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMessagePopupOpen, setIsMessagePopupOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const updateScrolled = (y = window.scrollY) => setScrolled(y > 40);

        const onScroll = () => updateScrolled();
        const onLenisScroll = ({ scroll }) => updateScrolled(scroll);

        window.addEventListener('scroll', onScroll, { passive: true });
        window.__lenis?.on('scroll', onLenisScroll);
        updateScrolled(window.__lenis?.scroll ?? window.scrollY);

        const bindLenis = () => {
            if (window.__lenis) {
                window.__lenis.on('scroll', onLenisScroll);
                updateScrolled(window.__lenis.scroll);
            }
        };
        const lenisTimer = window.setTimeout(bindLenis, 0);

        return () => {
            window.clearTimeout(lenisTimer);
            window.removeEventListener('scroll', onScroll);
            window.__lenis?.off('scroll', onLenisScroll);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        if (isDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    const handleDownload = (pdf, filename) => {
        const link = document.createElement('a');
        link.href = pdf;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsDropdownOpen(false);
    };

    const navLinks = [
        { label: 'Intro',        id: 'hero' },
        { label: 'Projects',     id: 'my-projects' },
        { label: 'Stackurn',     id: 'stackurn' },
        { label: 'Achievements', id: 'achievements' },
        { label: 'Contact',      id: 'contact' },
    ];

    return (
        <>
            <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
                <button
                    type="button"
                    className="navbar-brand"
                    onClick={() => smoothScrollTo('hero')}
                    aria-label="Back to top"
                >
                    AmmerVerse
                </button>

                <div className="navbar-actions">
                    <div className="navbar-dropdown" ref={dropdownRef}>
                        <button
                            type="button"
                            className="navbar-dropdown-toggle"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            aria-label="Download Resume"
                            aria-expanded={isDropdownOpen}
                        >
                            <span className="navbar-toggle-label-desktop">Resume ↓</span>
                            <img
                                className="navbar-toggle-icon-mobile"
                                src={downloadPdfIcon}
                                alt=""
                                aria-hidden={true}
                            />
                        </button>
                        {isDropdownOpen && (
                            <ul className="navbar-dropdown-menu">
                                <li>
                                    <button className="navbar-dropdown-item"
                                        onClick={() => handleDownload(cvPdf, 'cv.pdf')}>
                                        CV
                                    </button>
                                </li>
                                <li>
                                    <button className="navbar-dropdown-item"
                                        onClick={() => handleDownload(mobileDevResumePdf, 'mobile_dev_resume.pdf')}>
                                        Mobile Dev Resume
                                    </button>
                                </li>
                                <li>
                                    <button className="navbar-dropdown-item"
                                        onClick={() => handleDownload(webResumePdf, 'web_resume.pdf')}>
                                        Web Dev Resume
                                    </button>
                                </li>
                                <li>
                                    <button className="navbar-dropdown-item"
                                        onClick={() => handleDownload(aiResumePdf, 'AI_resume.pdf')}>
                                        AI Resume
                                    </button>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </nav>

            <nav className="navbar-tabs-dock" aria-label="Section navigation">
                <div className="navbar-tabs-container">
                    {navLinks.map(({ label, id }) => (
                        <button
                            key={id}
                            type="button"
                            className="nav-link"
                            onClick={() => smoothScrollTo(id)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </nav>

            {isMessagePopupOpen && (
                <MessagePopup onClose={() => setIsMessagePopupOpen(false)} />
            )}
        </>
    );
}
