import { PROJECTS } from '../../data/developerModels.js';

/** Fallback textures when a domain has few/no project images (Unsplash, stable URLs). */
export const STOCK_GALLERY_IMAGES = [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=640&q=80',
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=640&q=80',
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=640&q=80',
    'https://images.unsplash.com/photo-1419242902214-272b31f786?auto=format&fit=crop&w=640&q=80',
    'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=640&q=80',
    'https://images.unsplash.com/photo-1614728894747-a83421e2b64d?auto=format&fit=crop&w=640&q=80',
    'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=640&q=80',
    'https://images.unsplash.com/photo-1516339901600-2e1b62dc0c45?auto=format&fit=crop&w=640&q=80',
];

const MIN_IMAGES = 1;
const MAX_IMAGES = 1;

/**
 * One hero image per domain for the 3D orbit ring (not all project thumbs at once).
 */
export function collectDomainRingImages(domainOrder, developers, projects) {
    return domainOrder.map((devId) => {
        const developer = developers.find((d) => d.id === devId);
        const [hero] = collectGalleryImages(developer, projects);
        return hero;
    });
}

/**
 * Build texture URLs for the 3D orbit sphere from a developer's project assets.
 */
export function collectGalleryImages(developer, projectList = PROJECTS) {
    if (!developer) return STOCK_GALLERY_IMAGES.slice(0, MIN_IMAGES);

    const developerProjects = developer.projectIds
        .map((id) => projectList.find((p) => p.id === id))
        .filter(Boolean);

    const urls = [];

    for (const project of developerProjects) {
        if (project.images?.length) {
            for (const img of project.images) {
                if (typeof img === 'string') urls.push(img);
            }
        } else if (typeof project.thumbnail === 'string' && project.thumbnail) {
            urls.push(project.thumbnail);
        }
    }

    if (urls.length === 0) {
        return STOCK_GALLERY_IMAGES.slice(0, MIN_IMAGES);
    }

    const pool = [...urls];
    while (pool.length < MIN_IMAGES) {
        pool.push(urls[pool.length % urls.length]);
    }

    return pool.slice(0, MAX_IMAGES);
}
