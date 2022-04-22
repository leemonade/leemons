module.exports = {
  modelName: 'bookmarks',
  collectionName: 'bookmarks',
  attributes: {
    asset: {
      specificType: 'varchar(255)',
    },
    url: {
      type: 'string',
    },
    icon: {
      references: {
        collection: 'plugins_leebrary::files',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
