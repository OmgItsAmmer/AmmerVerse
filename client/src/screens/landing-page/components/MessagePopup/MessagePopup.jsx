import { useState } from 'react';
import './MessagePopup.css';

// Message Popup Component
export default function MessagePopup({ onClose }) {
    const [showSocials, setShowSocials] = useState(false);

    return (
        <div className="project-popup-overlay" onClick={onClose}>
            <div className="mobile-card-popup-content" onClick={(e) => e.stopPropagation()}>
                <button className="popup-close-btn" onClick={onClose}>×</button>

                <h2 className="popup-title message-title">Leave a Message</h2>

                <div className="message-form">
                    <textarea
                        className="message-input"
                        placeholder="Write your message here..."
                        rows="6"
                    ></textarea>
                    <button className="popup-cta-btn send-btn" onClick={onClose}>
                        Send Message
                    </button>

                    <button
                        className="outline-button small show-more-btn"
                        onClick={() => setShowSocials(!showSocials)}
                    >
                        {showSocials ? "Show Less" : "Show More"}
                    </button>

                    {showSocials && (
                        <div className="social-buttons-container">
                            <a href="#" className="social-btn upwork">Upwork</a>
                            <a href="#" className="social-btn whatsapp">WhatsApp</a>
                            <a href="#" className="social-btn linkedin">LinkedIn</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

