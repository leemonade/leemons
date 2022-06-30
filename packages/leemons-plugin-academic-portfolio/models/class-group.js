module.exports = {
  modelName: 'class-group',
  collectionName: 'class-group',
  options: {
    useTimestamps: true,
  },
  attributes: {
    class: {
      references: {
        collection: 'plugins_academic-portfolio::class',
      },
    },
    group: {
      references: {
        collection: 'plugins_academic-portfolio::groups',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
