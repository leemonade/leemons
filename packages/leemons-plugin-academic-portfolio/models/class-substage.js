module.exports = {
  modelName: 'class-substage',
  collectionName: 'class-substage',
  options: {
    useTimestamps: true,
  },
  attributes: {
    class: {
      references: {
        collection: 'plugins_academic-portfolio::class',
      },
    },
    substage: {
      references: {
        collection: 'plugins_academic-portfolio::groups',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
