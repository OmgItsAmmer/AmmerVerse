import stackurnProjectIndex from './stackurnProjectIndex.json';

export const STACKURN_PROJECT_INDEX = stackurnProjectIndex;

/**
 * Return projects whose indexed stackSlugs contain ALL selected slugs.
 * @param {string[]} selectedSlugs
 * @param {object[]} projects
 * @param {Array<{ projectId: number, stackSlugs: string[] }>} [index]
 */
export function matchProjectsByStacks(selectedSlugs, projects, index = STACKURN_PROJECT_INDEX) {
    if (!selectedSlugs?.length) return [];

    const slugSet = new Set(selectedSlugs);
    const matchedIds = index
        .filter(({ stackSlugs }) => [...slugSet].every((slug) => stackSlugs.includes(slug)))
        .map(({ projectId }) => projectId);

    return projects.filter((project) => matchedIds.includes(project.id));
}
