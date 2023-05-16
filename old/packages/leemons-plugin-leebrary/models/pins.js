module.exports = {
  modelName: 'pins',
  collectionName: 'pins',
  attributes: {
    asset: {
      specificType: 'varchar(255)',
    },
    userAgent: {
      references: {
        collection: 'plugins_users::user-agent',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
