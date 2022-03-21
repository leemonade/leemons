module.exports = {
  modelName: 'assets-categories',
  collectionName: 'assets-categories',
  attributes: {
    asset: {
      references: {
        collection: 'plugins_leebrary::assets',
      },
    },
    category: {
      references: {
        collection: 'plugins_leebrary::categories',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
