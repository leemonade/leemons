module.exports = {
  modelName: 'tasksVersioning',
  attributes: {
    last: {
      type: 'string',
    },
    current: {
      type: 'string',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
