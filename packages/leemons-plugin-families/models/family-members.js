module.exports = {
  modelName: 'family-members',
  collectionName: 'family-members',
  options: {
    useTimestamps: true,
  },
  attributes: {
    userAgent: {
      references: {
        collection: 'plugins_users::user-agent',
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
