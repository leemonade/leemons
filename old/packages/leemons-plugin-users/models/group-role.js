module.exports = {
  modelName: 'group-role',
  collectionName: 'group-role',
  options: {
    useTimestamps: true,
  },
  attributes: {
    group: {
      references: {
        collection: 'plugins_users::groups',
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
