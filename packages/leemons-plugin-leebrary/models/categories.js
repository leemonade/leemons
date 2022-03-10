module.exports = {
  modelName: 'categories',
  attributes: {
    name: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    displayName: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
  },
};
