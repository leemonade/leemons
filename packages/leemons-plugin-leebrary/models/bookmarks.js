module.exports = {
  modelName: 'bookmarks',
  collectionName: 'bookmarks',
  attributes: {
    asset: {
      references: {
        collection: 'plugins_leebrary::assets',
      },
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
