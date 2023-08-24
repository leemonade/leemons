export const allDocumentsKeys = [
  {
    plugin: 'plugin.content-creator',
    scope: 'document',
  },
];

export const getDocumentKey = (id) => [
  {
    ...allDocumentsKeys,
    id,
  },
];
