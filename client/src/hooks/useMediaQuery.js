import { useState, useEffect } from 'react';

/**
 * Custom hook to detect screen size and device type
 * @param {string} query - Media query string
 * @returns {boolean} - Whether the media query matches
 */
export function useMediaQuery(query) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        
        // Set initial value
        setMatches(media.matches);

        // Create event listener
        const listener = (e) => setMatches(e.matches);
        
        // Use addEventListener for modern browsers
        if (media.addEventListener) {
            media.addEventListener('change', listener);
        } else {
            // Fallback for older browsers
            media.addListener(listener);
        }

        // Cleanup
        return () => {
            if (media.removeEventListener) {
                media.removeEventListener('change', listener);
            } else {
                media.removeListener(listener);
            }
        };
    }, [query]);

    return matches;
}

/**
 * Hook specifically for mobile detection
 * @returns {boolean} - Whether the device is mobile
 */
export function useIsMobile() {
    return useMediaQuery('(max-width: 768px)');
}

/**
 * Hook specifically for tablet detection
 * @returns {boolean} - Whether the device is tablet
 */
export function useIsTablet() {
    return useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
}

/**
 * Hook specifically for desktop detection
 * @returns {boolean} - Whether the device is desktop
 */
export function useIsDesktop() {
    return useMediaQuery('(min-width: 1025px)');
}
