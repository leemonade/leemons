module.exports = {
  modelName: 'users-permissions',
  collectionName: 'users-permissions',
  attributes: {
    asset: {
      references: {
        collection: 'plugins_leebrary::assets',
      },
    },
    userAgent: {
      references: {
        collection: 'plugins_users::user-agent',
      },
    },
    role: {
      type: 'string',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
