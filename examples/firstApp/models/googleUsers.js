module.exports = {
  modelName: 'google_users',
  collectionName: 'google_users',
  info: {
    name: 'google users',
    description: "The google user's credentials (google id)",
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
    google_id: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
  },
};
