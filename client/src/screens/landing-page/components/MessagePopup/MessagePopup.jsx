import { useState } from 'react';
import './MessagePopup.css';
import upworkIcon from '../../../../assets/images/icons/upwork.png';

// Discord Webhook URL
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1465021897384136815/Gpmdj7AD5DUerAQN82v1Hp5hGbUUilY4EFdFPup4GYO2rKMO6OjCqlogKBwuAlZE-HMl';

// Validation functions
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePhone = (phone) => {
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');
    // Check if it has at least 10 digits (international format)
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
};

// Message Popup Component
export default function MessagePopup({ onClose }) {
    const [contactType, setContactType] = useState('email'); // 'email' or 'whatsapp'
    const [message, setMessage] = useState('');
    const [contactValue, setContactValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [validationError, setValidationError] = useState('');

    const handleContactTypeChange = (type) => {
        setContactType(type);
        setContactValue(''); // Clear contact value when switching types
        setValidationError(''); // Clear validation error
    };

    const handleContactValueChange = (e) => {
        const value = e.target.value;
        setContactValue(value);
        // Clear validation error when user starts typing
        if (validationError) {
            setValidationError('');
        }
    };

    const validateForm = () => {
        // Validate message
        if (!message.trim()) {
            setValidationError('Please enter a message');
            return false;
        }

        // Validate contact based on type
        if (!contactValue.trim()) {
            setValidationError(`Please enter your ${contactType === 'email' ? 'email' : 'phone number'}`);
            return false;
        }

        if (contactType === 'email') {
            if (!validateEmail(contactValue)) {
                setValidationError('Please enter a valid email address');
                return false;
            }
        } else {
            if (!validatePhone(contactValue)) {
                setValidationError('Please enter a valid phone number (10-15 digits)');
                return false;
            }
        }

        setValidationError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        setError('');
        setValidationError('');

        // Validate form
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Format the message for Discord
            const discordMessage = {
                content: `**New Message from Portfolio Contact Form**\n\n` +
                         `**Message:**\n${message}\n\n` +
                         `**Contact Type:** ${contactType === 'email' ? '📧 Email' : '📱 WhatsApp'}\n` +
                         `**Contact:** ${contactValue}\n\n` +
                         `*Sent at ${new Date().toLocaleString()}*`
            };

            const response = await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(discordMessage),
            });

            if (!response.ok) {
                throw new Error('Failed to send message. Please try again.');
            }

            // Success!
            setIsSuccess(true);
            
            // Reset form
            setMessage('');
            setContactValue('');
            
            // Close popup after 2 seconds
            setTimeout(() => {
                setIsSuccess(false);
                onClose();
            }, 2000);

        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="project-popup-overlay" onClick={onClose}>
            <div className="mobile-card-popup-content" onClick={(e) => e.stopPropagation()}>
                <button className="popup-close-btn" onClick={onClose}>×</button>

                <h2 className="popup-title message-title">Leave a Message</h2>

                {isSuccess && (
                    <div className="success-message">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        Message sent successfully!
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        {error}
                    </div>
                )}

                {validationError && (
                    <div className="validation-error-message">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        {validationError}
                    </div>
                )}

                <form className="message-form" onSubmit={handleSubmit}>
                    <textarea
                        className="message-input"
                        placeholder="Write your message here..."
                        rows="6"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={isLoading || isSuccess}
                        required
                    ></textarea>

                    <div className="contact-back-field">
                        <label className="contact-back-label">Contact me back at</label>
                        <div className="contact-type-toggle">
                            <button
                                type="button"
                                className={`toggle-option ${contactType === 'email' ? 'active' : ''}`}
                                onClick={() => handleContactTypeChange('email')}
                                disabled={isLoading || isSuccess}
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
                                onClick={() => handleContactTypeChange('whatsapp')}
                                disabled={isLoading || isSuccess}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                </svg>
                                WhatsApp
                            </button>
                        </div>
                        <input
                            type={contactType === 'email' ? 'email' : 'tel'}
                            className={`contact-input ${validationError && contactValue ? 'error' : ''}`}
                            placeholder={contactType === 'email' ? 'your.email@example.com' : '+1234567890'}
                            value={contactValue}
                            onChange={handleContactValueChange}
                            disabled={isLoading || isSuccess}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="popup-cta-btn send-btn"
                        disabled={isLoading || isSuccess}
                    >
                        {isLoading ? (
                            <>
                                <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                                </svg>
                                Sending...
                            </>
                        ) : isSuccess ? (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                Sent!
                            </>
                        ) : (
                            'Send Message'
                        )}
                    </button>

                    <div className="social-buttons-container">
                        <a 
                            href="https://www.upwork.com/freelancers/~yourprofile" 
                            className="social-btn upwork" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            aria-label="Upwork"
                        >
                            <img src={upworkIcon} alt="Upwork" className="social-icon-img" />
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

