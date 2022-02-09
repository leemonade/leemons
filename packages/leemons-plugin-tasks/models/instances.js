module.exports = {
  modelName: 'instances',
  attributes: {
    task: {
      type: 'string',
    },
    deadline: {
      type: 'datetime',
    },
    available: {
      type: 'datetime',
    },
    executionTime: {
      type: 'integer',
    },
    message: { type: 'string' },
  },
  primaryKey: {
    type: 'uuid',
  },
};
