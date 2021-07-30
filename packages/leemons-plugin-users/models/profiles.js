module.exports = {
  modelName: 'profiles',
  collectionName: 'profiles',
  options: {
    useTimestamps: true,
  },
  attributes: {
    name: {
      type: 'string',
      options: {
        notNull: true,
        unique: true,
      },
    },
    description: {
      type: 'string',
    },
    uri: {
      type: 'string',
      options: {
        notNull: true,
        unique: true,
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
