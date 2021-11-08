module.exports = {
  modelName: 'class-course',
  collectionName: 'class-course',
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
