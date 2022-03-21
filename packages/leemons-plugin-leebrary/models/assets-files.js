module.exports = {
  modelName: 'assets-files',
  collectionName: 'assets-files',
  attributes: {
    asset: {
      references: {
        collection: 'plugins_leebrary::assets',
      },
    },
    file: {
      references: {
        collection: 'plugins_leebrary::files',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
