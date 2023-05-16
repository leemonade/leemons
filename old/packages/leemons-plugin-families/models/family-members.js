module.exports = {
  modelName: 'family-members',
  collectionName: 'family-members',
  options: {
    useTimestamps: true,
  },
  attributes: {
    user: {
      references: {
        collection: 'plugins_users::users',
      },
    },
    family: {
      references: {
        collection: 'plugins_families::families',
      },
    },
    memberType: {
      type: 'string',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
