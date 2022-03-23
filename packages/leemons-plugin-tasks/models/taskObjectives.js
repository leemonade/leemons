module.exports = {
  modelName: 'taskObjectives',
  attributes: {
    task: {
      type: 'string',
    },
    objective: {
      type: 'string',
    },
    subject: {
      type: 'uuid',
    },
    position: {
      type: 'integer',
    },
  },
};
