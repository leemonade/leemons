module.exports = {
  modelName: 'tasksVersions',
  attributes: {
    task: {
      type: 'uuid',
    },
    major: {
      type: 'integer',
    },
    minor: {
      type: 'integer',
    },
    patch: {
      type: 'integer',
    },
    status: {
      type: 'string',
    },
  },
};
