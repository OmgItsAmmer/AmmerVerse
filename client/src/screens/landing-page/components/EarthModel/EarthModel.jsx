import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './EarthModel.css';

// Set Mapbox access token (Vite)
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

const ISLAMABAD_COORDS = [73.0479, 33.6844]; // [lng, lat]

/** Full-planet globe (before click): whole Earth visible, “from space” look. */
const GLOBE_CENTER = [0, 15];
const GLOBE_ZOOM = 0;

/** Fog: globe-only vs detailed map (Islamabad). */
function applyGlobeFog(map, mode) {
  if (mode === 'map') {
    map.setFog({
      range: [0.8, 2],
      color: '#ffffff',
      'horizon-blend': 0.35,
      'high-color': '#87b8f0',
      'space-color': '#0b1020',
      'star-intensity': 0.25,
    });
  } else {
    // Globe: dark space + stars + subtle horizon (satellite stays readable)
    map.setFog({
      range: [0.5, 2.5],
      color: '#000000',
      'horizon-blend': 0.12,
      'high-color': '#4466aa',
      'space-color': '#000000',
      'star-intensity': 0.55,
    });
  }
}

function createIslamabadMarker(map) {
  const markerEl = document.createElement('div');
  markerEl.className = 'islamabad-marker';
  markerEl.innerHTML = '<div class="marker-pin"></div>';
  return new mapboxgl.Marker({ element: markerEl })
    .setLngLat(ISLAMABAD_COORDS)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setText('Islamabad, Pakistan'))
    .addTo(map);
}

// Main EarthModel Component
export default function EarthModel({ isZoomed, onEarthClick, onClose }) {
  const [isHovered, setIsHovered] = useState(false);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const handleClick = () => {
    if (!isZoomed) {
      onEarthClick();
    }
  };

  // Handle ESC key to close zoomed view
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isZoomed && onClose) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed, onClose]);

  // Reset zoom complete state when closing
  useEffect(() => {
    if (!isZoomed) {
      // nothing special to reset here for now
    }
  }, [isZoomed]);

  // Initialize Mapbox map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    if (!mapboxgl.accessToken) {
      console.warn('VITE_MAPBOX_ACCESS_TOKEN is not set. Mapbox globe will not load.');
      return;
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      // Satellite + labels: globe shows full Earth when zoomed out; click → regional map
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: GLOBE_CENTER,
      zoom: GLOBE_ZOOM,
      projection: 'globe',
      antialias: true,
      minZoom: 0,
      maxZoom: 12,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on('style.load', () => {
      applyGlobeFog(map, 'globe');

      map.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
          showZoom: false,
          showCompass: false,
        }),
        'top-right'
      );
    });

    const bumpResize = () => {
      map.resize();
      requestAnimationFrame(() => map.resize());
    };

    map.once('load', bumpResize);
    map.once('idle', bumpResize);

    const container = mapContainerRef.current;
    const resizeObserver =
      container &&
      new ResizeObserver(() => {
        bumpResize();
      });
    if (container && resizeObserver) {
      resizeObserver.observe(container);
    }

    return () => {
      resizeObserver?.disconnect();
      markerRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Respond to zoomed state: camera, fog, and resize after layout transition
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (map.isStyleLoaded()) {
      applyGlobeFog(map, isZoomed ? 'map' : 'globe');
    }

    // Islamabad marker only in “map” mode after click (not on the full globe)
    if (isZoomed) {
      if (!markerRef.current) {
        markerRef.current = createIslamabadMarker(map);
      }
    } else {
      markerRef.current?.remove();
      markerRef.current = null;
    }

    // Ensure Mapbox knows about container size changes (small widget -> fullscreen)
    // Match the CSS transition duration (~1000ms) before resizing.
    const resizeTimeout = setTimeout(() => {
      map.resize();
      requestAnimationFrame(() => map.resize());
    }, 1050);

    if (isZoomed) {
      map.flyTo({
        center: ISLAMABAD_COORDS,
        zoom: 5,
        pitch: 35,
        bearing: 0,
        duration: 1800,
        essential: true,
      });
    } else {
      map.easeTo({
        center: GLOBE_CENTER,
        zoom: GLOBE_ZOOM,
        pitch: 0,
        bearing: 0,
        duration: 1200,
      });
    }

    return () => clearTimeout(resizeTimeout);
  }, [isZoomed]);

  return (
    <div 
      className={`earth-model-container ${isZoomed ? 'zoomed' : ''} ${isHovered && !isZoomed ? 'hovered' : ''}`}
      onMouseEnter={() => !isZoomed && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{ cursor: isZoomed ? 'grab' : 'pointer' }}
    >
      {/* Close button when zoomed */}
      {isZoomed && onClose && (
        <button 
          className="earth-close-button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close Earth view"
        >
          ✕
        </button>
      )}

      {/* Mapbox globe container */}
      <div ref={mapContainerRef} className="earth-mapbox-globe" />

      {/* Instructions when zoomed */}
      {isZoomed && (
        <div className="earth-instructions">
          <p>Drag to rotate • Scroll to zoom • ESC or ✕ to close</p>
        </div>
      )}
    </div>
  );
}

