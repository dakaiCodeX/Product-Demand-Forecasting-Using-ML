export const matchSorter = (query: string, candidates: string[]): boolean => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }
  return candidates.some((candidate) => candidate.toLowerCase().includes(normalizedQuery));
};
