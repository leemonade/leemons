module.exports = {
  modelName: 'profiles-config',
  collectionName: 'profiles-config',
  options: {
    useTimestamps: true,
  },
  attributes: {
    type: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    profile: {
      references: {
        collection: 'plugins_users::profiles',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
