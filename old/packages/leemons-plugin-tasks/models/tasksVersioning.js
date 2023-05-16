module.exports = {
  modelName: 'tasksVersioning',
  options: {
    useTimestamps: true,
  },
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
