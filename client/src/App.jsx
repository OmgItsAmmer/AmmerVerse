import { useEffect } from 'react';
import Lenis from 'lenis';
import LandingPage from "./screens/landing-page/LandingPage.jsx";
import "./styles/globals.css";

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.35,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      wheelMultiplier: 0.45,
      touchMultiplier: 0.72,
      lerp: 0.055,
      syncTouch: true,
    });

    window.__lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return <LandingPage />;
}
