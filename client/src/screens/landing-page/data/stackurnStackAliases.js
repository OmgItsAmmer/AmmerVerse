/**
 * Maps stackurn ring slugs to searchable tokens found in project techStack text.
 * Used when deriving or validating stackurnProjectIndex.json entries.
 */
export const STACK_SLUG_ALIASES = {
    react: ['react'],
    flutter: ['flutter'],
    nextdotjs: ['next.js', 'nextjs', 'nextdotjs'],
    typescript: ['typescript', 'ts'],
    vite: ['vite'],
    tailwindcss: ['tailwind', 'tailwindcss'],
    python: ['python', 'flask'],
    fastapi: ['fastapi'],
    docker: ['docker'],
    rust: ['rust'],
    kubernetes: ['kubernetes', 'k8s', 'gke'],
    githubactions: ['github actions', 'githubactions', 'ci/cd'],
    openai: ['openai', 'gpt'],
    langchain: ['langchain', 'langgraph'],
    huggingface: ['huggingface', 'hugging face'],
    ollama: ['ollama', 'vllm'],
    pinecone: ['pinecone', 'chromadb', 'chroma'],
    mongodb: ['mongodb', 'mongo'],
    supabase: ['supabase'],
    postgresql: ['postgresql', 'postgres', 'pg'],
    redis: ['redis'],
    neo4j: ['neo4j'],
};

/** All valid slugs that appear on Stackurn rings */
export function getAllRingSlugs(layers) {
    return layers.flatMap((layer) => layer.logos.map((logo) => logo.slug));
}
