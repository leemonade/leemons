module.exports = {
  attributes: {
    description: {
      type: 'string',
      options: {
        notNull: true,
        unique: true,
      },
    },
  },
};
