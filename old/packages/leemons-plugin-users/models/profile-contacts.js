module.exports = {
  modelName: 'profile-contacts',
  collectionName: 'profile-contacts',
  options: {
    useTimestamps: true,
  },
  attributes: {
    fromProfile: {
      references: {
        collection: 'plugins_users::profiles',
      },
    },
    toProfile: {
      references: {
        collection: 'plugins_users::profiles',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
