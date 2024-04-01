export const allKnowledgeAreaKeys = [
  {
    plugin: 'plugin.academic-portfolio',
    scope: 'knowledge-areas',
  },
];

export const getKnowledgeAreasKey = (center) => [
  {
    ...allKnowledgeAreaKeys,
    center,
  },
];
