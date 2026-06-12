/**
 * Face particle sources — tight face-only crops per photo.
 *
 * ─── For best results, add a clean headshot ─────────────────────────
 *  Put it at  client/src/assets/images/face/portrait.jpeg
 *  - Face fills ≥70% of frame, looking at camera
 *  - Neutral / dark background
 *  - Minimum 600×750 px
 *  Then set PREFERRED_FACE to that import.
 */

import face1 from '../../../assets/images/pfps/1.jpeg';
import face2 from '../../../assets/images/pfps/2.jpeg';
import face3 from '../../../assets/images/pfps/3.jpeg';
import face4 from '../../../assets/images/pfps/4.jpeg';

export const PREFERRED_FACE = null;

/**
 * crop: fractions of the image's natural width / height.
 * Photo analysis (from image content):
 *   1 — full-body formal, face is top ~26% centered
 *   2 — seated red backdrop, face top ~42% with large fill
 *   3 — cafe head-shoulder, face dominates top ~50%
 *   4 — gym mirror selfie, face upper-left
 */
export const FACE_SOURCES = [
    {
        id: 'pfp-1',
        src: face1,
        crop: { sx: 0.30, sy: 0.01, sw: 0.40, sh: 0.22 },
    },
    {
        id: 'pfp-2',
        src: face2,
        crop: { sx: 0.18, sy: 0.00, sw: 0.64, sh: 0.36 },
    },
    {
        id: 'pfp-3',
        src: face3,
        crop: { sx: 0.14, sy: 0.00, sw: 0.72, sh: 0.42 },
    },
    {
        id: 'pfp-4',
        src: face4,
        crop: { sx: 0.08, sy: 0.00, sw: 0.50, sh: 0.32 },
    },
];
