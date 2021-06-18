module.exports = {
  modelName: 'profile-role',
  collectionName: 'profile-role',
  options: {
    useTimestamps: true,
  },
  attributes: {
    profile: {
      references: {
        collection: 'plugins_users-groups-roles::profiles',
      },
    },
    role: {
      references: {
        collection: 'plugins_users-groups-roles::roles',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
