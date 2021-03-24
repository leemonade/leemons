module.exports = {
  modelName: 'password_users',
  collectionName: 'password_users',
  info: {
    name: 'users with username and password',
    description: "The user's credentials (password and salt)",
  },
  options: {
    useTimestamps: true,
  },
  attributes: {
    user_id: {
      references: {
        collection: 'global::users',
        relation: 'one to one',
        options: {
          notNull: true,
        },
      },
    },
    password: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    salt: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
  },
};
