module.exports = {
  modelName: 'profile-role',
  collectionName: 'profile-role',
  options: {
    useTimestamps: true,
  },
  attributes: {
    profile: {
      references: {
        collection: 'plugins_users::profiles',
      },
    },
    role: {
      references: {
        collection: 'plugins_users::roles',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
