export const allKnowledgeAreas = [
  {
    plugin: 'plugin.academic-portfolio',
    scope: 'knowledge-areas',
  },
];

export const getKnowledgeAreasKey = (center) => [
  {
    ...allKnowledgeAreas,
    center,
  },
];
