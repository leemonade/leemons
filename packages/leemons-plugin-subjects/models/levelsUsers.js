module.exports = {
  modelName: 'levels-users',
  options: {
    useTimestamps: true,
  },
  attributes: {
    level: {
      references: {
        collection: 'plugins_classroom::levels',
      },
      options: {
        unique: false,
        notNull: true,
      },
    },
    user: {
      references: {
        collection: 'plugins_users::user-agent',
      },
      options: {
        unique: false,
        notNull: true,
      },
    },
    role: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
