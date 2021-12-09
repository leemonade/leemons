module.exports = {
  modelName: 'class-knowledges',
  collectionName: 'class-knowledges',
  options: {
    useTimestamps: true,
  },
  attributes: {
    class: {
      references: {
        collection: 'plugins_academic-portfolio::class',
      },
    },
    knowledge: {
      references: {
        collection: 'plugins_academic-portfolio::knowledges',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
