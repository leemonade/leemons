module.exports = {
  modelName: 'instances',
  options: {
    useTimestamps: true,
  },
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
    executionTime: {
      type: 'integer',
    },
    message: { type: 'string' },
    status: { type: 'string' },
  },
  primaryKey: {
    type: 'uuid',
  },
};
