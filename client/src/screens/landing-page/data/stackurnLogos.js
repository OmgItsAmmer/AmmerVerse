/**
 * Stackurn logo config — two rings orbiting the Saturn center
 * slug: used with simpleicons CDN:  https://cdn.simpleicons.org/{slug}/{hex-without-hash}
 * fallback: displayed when CDN fetch fails
 */

export const INNER_RING = [
    { name: 'OpenAI',      slug: 'openai',      color: '412991', fallback: 'OpenAI' },
    { name: 'LangChain',   slug: 'langchain',   color: '1C3C3C', fallback: 'LangChain' },
    { name: 'HuggingFace', slug: 'huggingface', color: 'FFD21E', fallback: '🤗' },
    { name: 'Pinecone',    slug: 'pinecone',    color: '000000', fallback: 'Pinecone' },
    { name: 'Python',      slug: 'python',      color: '3776AB', fallback: 'Python' },
    { name: 'Docker',      slug: 'docker',      color: '2496ED', fallback: 'Docker' },
    { name: 'FastAPI',     slug: 'fastapi',     color: '009688', fallback: 'FastAPI' },
    { name: 'Ollama',      slug: 'ollama',      color: '000000', fallback: 'Ollama' },
];

export const OUTER_RING = [
    { name: 'React',      slug: 'react',       color: '61DAFB', fallback: 'React' },
    { name: 'Flutter',    slug: 'flutter',     color: '02569B', fallback: 'Flutter' },
    { name: 'Rust',       slug: 'rust',        color: 'CE412B', fallback: 'Rust' },
    { name: 'Kubernetes', slug: 'kubernetes',  color: '326CE5', fallback: 'K8s' },
    { name: 'Supabase',   slug: 'supabase',    color: '3FCF8E', fallback: 'Supabase' },
    { name: 'MongoDB',    slug: 'mongodb',     color: '47A248', fallback: 'MongoDB' },
    { name: 'GH Actions', slug: 'githubactions', color: '2088FF', fallback: 'Actions' },
    { name: 'Next.js',    slug: 'nextdotjs',   color: 'EAEAEA', fallback: 'Next.js' },
];

export function getIconUrl(slug, color) {
    return `https://cdn.simpleicons.org/${slug}/${color}`;
}
