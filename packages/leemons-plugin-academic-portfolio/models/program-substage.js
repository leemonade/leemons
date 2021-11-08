module.exports = {
  modelName: 'program-substage',
  collectionName: 'program-substage',
  options: {
    useTimestamps: true,
  },
  attributes: {
    program: {
      references: {
        collection: 'plugins_academic-portfolio::programs',
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
