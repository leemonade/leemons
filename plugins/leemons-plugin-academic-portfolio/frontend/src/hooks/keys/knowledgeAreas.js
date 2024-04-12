export const allKnowledgeAreaKeys = [
  {
    plugin: 'plugin.academic-portfolio',
    scope: 'knowledge-areas',
  },
];

export const getKnowledgeAreasKey = (center) => [
  {
    ...allKnowledgeAreaKeys[0],
    center,
  },
];

export const getKnowledgeAreasByIdKey = (id) => [
  {
    ...allKnowledgeAreaKeys[0],
    id,
  },
];
