import { useEffect } from 'react';

const BODY_LOCK_CLASS = 'scroll-locked';

/**
 * Pauses Lenis smooth scroll and locks the page while overlays/panels are open.
 */
export function useScrollLock(active = true) {
    useEffect(() => {
        if (!active) return;

        document.body.classList.add(BODY_LOCK_CLASS);
        window.__lenis?.stop();

        return () => {
            document.body.classList.remove(BODY_LOCK_CLASS);
            window.__lenis?.start();
        };
    }, [active]);
}
