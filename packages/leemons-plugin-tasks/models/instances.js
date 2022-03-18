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
    alwaysOpen: {
      type: 'boolean',
    },
    closeDate: {
      type: 'datetime',
    },
    message: { type: 'string' },
    status: { type: 'string' },
    showCurriculum: {
      type: 'json',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
