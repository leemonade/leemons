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
    message: { type: 'richtext' },
    status: { type: 'string' },
    showCurriculum: {
      type: 'text',
      textType: 'mediumText',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
