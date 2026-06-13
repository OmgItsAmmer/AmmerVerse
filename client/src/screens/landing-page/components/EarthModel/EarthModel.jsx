import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './EarthModel.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

const GLOBE_CENTER = [0, 15];
const GLOBE_ZOOM = 0;
const AUTO_ROTATE_DEG_PER_SEC = 2.5;
const AUTO_ROTATE_RESUME_MS = 1200;

function applyGlobeOnlyFog(map) {
  map.setFog({
    range: [1, 1],
    color: 'transparent',
    'horizon-blend': 0,
    'high-color': 'transparent',
    'space-color': 'transparent',
    'star-intensity': 0,
  });
}

function bumpMapResize(map) {
  map.resize();
  requestAnimationFrame(() => map.resize());
}

/** Half-globe preview on the achievements section edge */
export default function EarthModel({ embedded = false, size }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const rafIdRef = useRef(0);
  const resumeTimerRef = useRef(0);
  const userInteractingRef = useRef(false);
  const dragMovedRef = useRef(false);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    if (!mapboxgl.accessToken) {
      console.warn('VITE_MAPBOX_ACCESS_TOKEN is not set. Mapbox globe will not load.');
      return;
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: GLOBE_CENTER,
      zoom: GLOBE_ZOOM,
      minZoom: GLOBE_ZOOM,
      maxZoom: GLOBE_ZOOM,
      projection: 'globe',
      antialias: true,
      attributionControl: false,
      scrollZoom: false,
      doubleClickZoom: false,
      touchPitch: false,
      boxZoom: false,
      keyboard: false,
    });

    mapRef.current = map;

    map.on('style.load', () => {
      applyGlobeOnlyFog(map);
      map.getCanvas().style.background = 'transparent';
    });

    map.once('load', () => bumpMapResize(map));

    let lastFrameTime = performance.now();

    const pauseAutoRotate = () => {
      userInteractingRef.current = true;
      dragMovedRef.current = false;
      window.clearTimeout(resumeTimerRef.current);
    };

    const markDragged = () => {
      dragMovedRef.current = true;
    };

    const scheduleAutoRotateResume = () => {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = window.setTimeout(() => {
        userInteractingRef.current = false;
        lastFrameTime = performance.now();
      }, AUTO_ROTATE_RESUME_MS);
    };

    const tickAutoRotate = (now) => {
      if (!userInteractingRef.current && map.isStyleLoaded()) {
        const deltaSec = Math.min((now - lastFrameTime) / 1000, 0.05);
        const center = map.getCenter();
        map.setCenter([center.lng - AUTO_ROTATE_DEG_PER_SEC * deltaSec, center.lat]);
      }
      lastFrameTime = now;
      rafIdRef.current = requestAnimationFrame(tickAutoRotate);
    };

    map.on('dragstart', pauseAutoRotate);
    map.on('drag', markDragged);
    map.on('dragend', scheduleAutoRotateResume);

    map.once('load', () => {
      lastFrameTime = performance.now();
      rafIdRef.current = requestAnimationFrame(tickAutoRotate);
    });

    const container = mapContainerRef.current;
    const resizeObserver =
      container &&
      new ResizeObserver(() => {
        if (mapRef.current) bumpMapResize(mapRef.current);
      });
    if (container && resizeObserver) {
      resizeObserver.observe(container);
    }

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      window.clearTimeout(resumeTimerRef.current);
      map.off('dragstart', pauseAutoRotate);
      map.off('drag', markDragged);
      map.off('dragend', scheduleAutoRotateResume);
      resizeObserver?.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!size || !mapRef.current) return;
    bumpMapResize(mapRef.current);
  }, [size]);

  const embeddedStyle =
    embedded && size ? { width: `${size}px`, height: `${size}px` } : undefined;

  return (
    <div
      className={`earth-model-container ${embedded ? 'embedded' : ''}`}
      style={embeddedStyle}
    >
      <div ref={mapContainerRef} className="earth-mapbox-globe" />
    </div>
  );
}
