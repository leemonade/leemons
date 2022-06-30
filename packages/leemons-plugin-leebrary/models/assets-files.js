module.exports = {
  modelName: 'assets-files',
  collectionName: 'assets-files',
  attributes: {
    asset: {
      specificType: 'varchar(255)',
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
