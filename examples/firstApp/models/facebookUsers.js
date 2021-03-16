module.exports = {
  modelName: 'facebook_users',
  collectionName: 'facebook_users',
  info: {
    name: 'facebook users',
    description: "The facebook user's credentials (facebook id)",
  },
  options: {
    useTimestamps: true,
  },
  attributes: {
    user_id: {
      references: {
        collection: 'global.users',
        relation: 'one to one',
        options: {
          notNull: true,
        },
      },
    },
    facebook_id: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
  },
};
