module.exports = {
  modelName: 'teachers',
  attributes: {
    assignableInstance: {
      type: 'uuid',
      options: {
        notNull: true,
      },
    },
    teacher: {
      type: 'uuid',
      options: {
        notNull: true,
      },
    },
    type: {
      type: 'string',
    },
  },
};
