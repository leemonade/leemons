module.exports = {
  modelName: 'instances',
  attributes: {
    task: {
      type: 'string',
    },
    startDate: {
      type: 'datetime',
    },
    deadline: {
      type: 'datetime',
    },
    visualizationDate: {
      type: 'datetime',
    },
    limitedExecution: {
      type: 'integer',
    },
    message: { type: 'string' },
  },
  primaryKey: {
    type: 'uuid',
  },
};
