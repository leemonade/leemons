module.exports = {
  modelName: 'role-center',
  collectionName: 'role-center',
  options: {
    useTimestamps: true,
  },
  attributes: {
    role: {
      references: {
        collection: 'plugins_users::roles',
      },
    },
    center: {
      references: {
        collection: 'plugins_users::centers',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
