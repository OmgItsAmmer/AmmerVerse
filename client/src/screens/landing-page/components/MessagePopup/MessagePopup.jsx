import { useState } from 'react';
import './MessagePopup.css';

// Message Popup Component
export default function MessagePopup({ onClose }) {
    const [contactType, setContactType] = useState('email'); // 'email' or 'whatsapp'
    const [message, setMessage] = useState('');
    const [contactValue, setContactValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log({ message, contactType, contactValue });
        onClose();
    };

    return (
        <div className="project-popup-overlay" onClick={onClose}>
            <div className="mobile-card-popup-content" onClick={(e) => e.stopPropagation()}>
                <button className="popup-close-btn" onClick={onClose}>×</button>

                <h2 className="popup-title message-title">Leave a Message</h2>

                <form className="message-form" onSubmit={handleSubmit}>
                    <textarea
                        className="message-input"
                        placeholder="Write your message here..."
                        rows="6"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    ></textarea>

                    <div className="contact-back-field">
                        <label className="contact-back-label">Contact me back at</label>
                        <div className="contact-type-toggle">
                            <button
                                type="button"
                                className={`toggle-option ${contactType === 'email' ? 'active' : ''}`}
                                onClick={() => setContactType('email')}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                                Email
                            </button>
                            <button
                                type="button"
                                className={`toggle-option ${contactType === 'whatsapp' ? 'active' : ''}`}
                                onClick={() => setContactType('whatsapp')}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                </svg>
                                WhatsApp
                            </button>
                        </div>
                        <input
                            type={contactType === 'email' ? 'email' : 'tel'}
                            className="contact-input"
                            placeholder={contactType === 'email' ? 'your.email@example.com' : '+1234567890'}
                            value={contactValue}
                            onChange={(e) => setContactValue(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="popup-cta-btn send-btn">
                        Send Message
                    </button>

                    <div className="social-buttons-container">
                        <a 
                            href="https://www.upwork.com/freelancers/~yourprofile" 
                            className="social-btn upwork" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            aria-label="Upwork"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-4.948 2.002-1.935 3.633-2.98 4.06-3.26.584-.38.892-.472 1.301-.472.227 0 .42.018.59.05 1.139.222 1.97 1.181 1.97 2.482 0 .915-.438 1.755-1.155 2.281-.643.463-1.38.701-2.076.701-.285 0-.564-.038-.833-.117l-1.02 4.82c-.11.52-.2.96-.26 1.29-.06.33-.09.58-.09.75 0 .663.396 1.21 1.037 1.21.56 0 .96-.21 1.18-.62.22-.41.33-.95.33-1.62 0-.28-.02-.6-.06-.95l.93-4.39c.06-.3.1-.58.1-.84 0-.48-.13-.87-.38-1.16-.26-.3-.63-.45-1.11-.45-.42 0-.81.12-1.16.36-.35.24-.65.58-.9 1.02l-1.31 6.18c-.08.38-.12.72-.12 1.02 0 .42.1.75.3.99.2.24.48.36.84.36.48 0 .9-.21 1.26-.63.36-.42.54-1 .54-1.74 0-.28-.03-.6-.09-.96l-.93 4.38c-.06.3-.1.58-.1.84 0 .48.13.87.38 1.16.26.3.63.45 1.11.45.42 0 .81-.12 1.16-.36.35-.24.65-.58.9-1.02l1.31-6.18c.08-.38.12-.72.12-1.02 0-.42-.1-.75-.3-.99-.2-.24-.48-.36-.84-.36-.48 0-.9.21-1.26.63-.36.42-.54 1-.54 1.74 0 .28.03.6.09.96l-.93-4.38c-.06-.3-.1-.58-.1-.84 0-.48.13-.87.38-1.16.26-.3.63-.45 1.11-.45.42 0 .81.12 1.16.36.35.24.65.58.9 1.02l1.31 6.18c.08.38.12.72.12 1.02 0 .42-.1.75-.3.99-.2.24-.48.36-.84.36-.48 0-.9-.21-1.26-.63-.36-.42-.54-1-.54-1.74 0-.28.03-.6.09-.96l.93-4.38c.06-.3.1-.58.1-.84 0-.48-.13-.87-.38-1.16-.26-.3-.63-.45-1.11-.45-.42 0-.81.12-1.16.36-.35.24-.65.58-.9 1.02l-1.31 6.18c-.08.38-.12.72-.12 1.02 0 .42.1.75.3.99.2.24.48.36.84.36.48 0 .9-.21 1.26-.63.36-.42.54-1 .54-1.74 0-.28-.03-.6-.09-.96l-.93 4.38c-.06.3-.1.58-.1.84 0 .48.13.87.38 1.16.26.3.63.45 1.11.45.42 0 .81-.12 1.16-.36.35-.24.65-.58.9-1.02l1.31-6.18c.08-.38.12-.72.12-1.02 0-.42-.1-.75-.3-.99-.2-.24-.48-.36-.84-.36z"/>
                            </svg>
                        </a>
                        <a 
                            href="https://wa.me/yournumber" 
                            className="social-btn whatsapp" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            aria-label="WhatsApp"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                        </a>
                        <a 
                            href="https://www.linkedin.com/in/yourprofile" 
                            className="social-btn linkedin" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}

