module.exports = {
  modelName: 'report',
  collectionName: 'report',
  connection: 'mongo',
  options: {
    useTimestamps: true,
  },
  attributes: {
    report: {
      type: 'mixed',
    },
    program: {
      type: 'string',
    },
    course: {
      type: 'string',
    },
    userAgent: {
      type: 'string',
    },
  },
};
