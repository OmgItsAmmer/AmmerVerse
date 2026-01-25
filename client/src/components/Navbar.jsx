import { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import cvPdf from '../assets/Docs/cv.pdf';
import mobileDevResumePdf from '../assets/Docs/mobile_dev_resume.pdf';
import webResumePdf from '../assets/Docs/web_resume.pdf';
import aiResumePdf from '../assets/Docs/AI_resume.pdf';
import MessagePopup from '../screens/landing-page/components/MessagePopup';

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMessagePopupOpen, setIsMessagePopupOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
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

    return (
        <nav className="navbar">
            <div className="navbar-brand">AmmerVerse</div>
            <div className="navbar-links">
                <button 
                    className="navbar-dropdown-toggle"
                    onClick={() => setIsMessagePopupOpen(true)}
                >
                    Contacts
                </button>
                <div className="navbar-dropdown" ref={dropdownRef}>
                    <button 
                        className="navbar-dropdown-toggle"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        Downloads ▾
                    </button>
                    {isDropdownOpen && (
                        <ul className="navbar-dropdown-menu">
                            <li>
                                <button 
                                    className="navbar-dropdown-item"
                                    onClick={() => handleDownload(cvPdf, 'cv.pdf')}
                                >
                                    CV
                                </button>
                            </li>
                            <li>
                                <button 
                                    className="navbar-dropdown-item"
                                    onClick={() => handleDownload(mobileDevResumePdf, 'mobile_dev_resume.pdf')}
                                >
                                    Mobile Dev Resume
                                </button>
                            </li>
                            <li>
                                <button 
                                    className="navbar-dropdown-item"
                                    onClick={() => handleDownload(webResumePdf, 'web_resume.pdf')}
                                >
                                    Web Dev Resume
                                </button>
                            </li>
                            <li>
                                <button 
                                    className="navbar-dropdown-item"
                                    onClick={() => handleDownload(aiResumePdf, 'AI_resume.pdf')}
                                >
                                    AI Resume
                                </button>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
            {isMessagePopupOpen && (
                <MessagePopup onClose={() => setIsMessagePopupOpen(false)} />
            )}
        </nav>
    );
}
