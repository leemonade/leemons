export const allKnowledgeAreaKeys = [
  {
    plugin: 'plugin.academic-portfolio',
    scope: 'knowledge-area',
    type: 'GET',
  },
];

export const getKnowledgeAreaKey = (id) => [
  {
    ...allKnowledgeAreaKeys,
    id,
  },
];
