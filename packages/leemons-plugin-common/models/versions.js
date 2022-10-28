module.exports = {
  modelName: 'versions',
  attributes: {
    uuid: {
      type: 'uuid',
      options: {
        notNull: true,
        index: true,
      },
    },
    major: {
      type: 'number',
      options: {
        notNull: true,
      },
    },
    minor: {
      type: 'number',
      options: {
        notNull: true,
      },
    },
    patch: {
      type: 'number',
      options: {
        notNull: true,
      },
    },
    published: {
      type: 'boolean',
    },
  },
};
