module.exports = {
  modelName: 'tasksVersioning',
  attributes: {
    name: {
      type: 'string',
    },
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
