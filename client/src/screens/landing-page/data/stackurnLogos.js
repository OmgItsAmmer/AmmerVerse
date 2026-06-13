/**
 * Stackurn — four orbit layers (outer → inner): Frontend, Backend, AI, DB
 * slug → https://cdn.simpleicons.org/{slug}/{hex-without-hash}
 */

export const FRONTEND_RING = [
    { name: 'React', slug: 'react', color: '61DAFB', fallback: 'React' },
    { name: 'Flutter', slug: 'flutter', color: '02569B', fallback: 'Flutter' },
    { name: 'Next.js', slug: 'nextdotjs', color: 'EAEAEA', fallback: 'Next.js' },
    { name: 'TypeScript', slug: 'typescript', color: '3178C6', fallback: 'TS' },
    { name: 'Vite', slug: 'vite', color: '646CFF', fallback: 'Vite' },
    { name: 'Tailwind', slug: 'tailwindcss', color: '06B6D4', fallback: 'TW' },
];

export const BACKEND_RING = [
    { name: 'Python', slug: 'python', color: '3776AB', fallback: 'Python' },
    { name: 'FastAPI', slug: 'fastapi', color: '009688', fallback: 'FastAPI' },
    { name: 'Docker', slug: 'docker', color: '2496ED', fallback: 'Docker' },
    { name: 'Rust', slug: 'rust', color: 'CE412B', fallback: 'Rust' },
    { name: 'Kubernetes', slug: 'kubernetes', color: '326CE5', fallback: 'K8s' },
    { name: 'GH Actions', slug: 'githubactions', color: '2088FF', fallback: 'Actions' },
];

export const AI_RING = [
    { name: 'OpenAI', slug: 'openai', color: '412991', fallback: 'OpenAI' },
    { name: 'LangChain', slug: 'langchain', color: '1C3C3C', fallback: 'LangChain' },
    { name: 'HuggingFace', slug: 'huggingface', color: 'FFD21E', fallback: '🤗' },
    { name: 'Ollama', slug: 'ollama', color: '000000', fallback: 'Ollama' },
    { name: 'Pinecone', slug: 'pinecone', color: '000000', fallback: 'Pinecone' },
];

export const DB_RING = [
    { name: 'MongoDB', slug: 'mongodb', color: '47A248', fallback: 'MongoDB' },
    { name: 'Supabase', slug: 'supabase', color: '3FCF8E', fallback: 'Supabase' },
    { name: 'PostgreSQL', slug: 'postgresql', color: '4169E1', fallback: 'PG' },
    { name: 'Redis', slug: 'redis', color: 'FF4438', fallback: 'Redis' },
    { name: 'Neo4j', slug: 'neo4j', color: '008CC1', fallback: 'Neo4j' },
];

/**
 * Ring radii (base px, before viewport scale) — built inside→out with wide gaps.
 */
export const STACKURN_SATURN_INNER_RADIUS = 155;
export const STACKURN_RING_TRACK_PAD = 40;

const R_DB = 250;
const R_AI = R_DB + 210;
const R_BACKEND = R_AI + 240;
const R_FRONTEND = R_BACKEND + 240;

/** Outer → inner */
export const STACKURN_LAYERS = [
    { id: 'frontend', label: 'Frontend', color: '#22D3EE', radius: R_FRONTEND, logos: FRONTEND_RING },
    { id: 'backend', label: 'Backend', color: '#34D399', radius: R_BACKEND, logos: BACKEND_RING },
    { id: 'ai', label: 'AI', color: '#A855F7', radius: R_AI, logos: AI_RING },
    { id: 'db', label: 'Database', color: '#FBBF24', radius: R_DB, logos: DB_RING },
];

/** @deprecated use STACKURN_LAYERS */
export const INNER_RING = AI_RING;
/** @deprecated use STACKURN_LAYERS */
export const OUTER_RING = FRONTEND_RING;

export function getIconUrl(slug, color) {
    return `https://cdn.simpleicons.org/${slug}/${color}`;
}
