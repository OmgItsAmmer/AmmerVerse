import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './EarthModel.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

/** H-12 campus, Islamabad (NUST sector) */
const H12_CAMPUS_COORDS = [72.9897, 33.6427];

function bumpMapResize(map) {
  map.resize();
  requestAnimationFrame(() => map.resize());
}

function createH12Marker(map) {
  const markerEl = document.createElement('div');
  markerEl.className = 'h12-campus-marker';
  markerEl.innerHTML = '<div class="marker-pin"></div><span class="marker-label">H-12 Campus</span>';

  return new mapboxgl.Marker({ element: markerEl, anchor: 'bottom' })
    .setLngLat(H12_CAMPUS_COORDS)
    .setPopup(
      new mapboxgl.Popup({ offset: 28, closeButton: false }).setHTML(
        '<strong>My Location</strong><br/>Islamabad, Pakistan'
      )
    )
    .addTo(map);
}

export function EarthMapFullscreen({ onClose }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    document.body.classList.add('earth-map-open');
    window.__lenis?.stop();

    return () => {
      document.body.classList.remove('earth-map-open');
      window.__lenis?.start();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapboxgl.accessToken) {
      console.warn('VITE_MAPBOX_ACCESS_TOKEN is not set. Mapbox map will not load.');
      return;
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: H12_CAMPUS_COORDS,
      zoom: 15.5,
      pitch: 50,
      bearing: -18,
      antialias: true,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on('load', () => {
      markerRef.current = createH12Marker(map);
      bumpMapResize(map);
      window.setTimeout(() => markerRef.current?.togglePopup(), 800);
    });

    const container = mapContainerRef.current;
    const resizeObserver = new ResizeObserver(() => bumpMapResize(map));
    resizeObserver.observe(container);

    [0, 100, 300].forEach((delay) => {
      window.setTimeout(() => bumpMapResize(map), delay);
    });

    return () => {
      resizeObserver.disconnect();
      markerRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return createPortal(
    <div className="earth-model-container earth-map-fullscreen">
      <button
        type="button"
        className="earth-close-button"
        onClick={onClose}
        aria-label="Close map view"
      >
        ✕
      </button>

      <div ref={mapContainerRef} className="earth-mapbox-globe" style={{ cursor: 'grab' }} />

      <div className="earth-instructions">
        <p>Drag to explore · Scroll to zoom · ESC or ✕ to return to globe</p>
      </div>
    </div>,
    document.body
  );
}
