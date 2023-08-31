module.exports = {
  modelName: 'scorm-progress',
  collectionName: 'scorm-progress',
  connection: 'mongo',

  options: {
    useTimestamps: true,
  },
  attributes: {
    instance: {
      type: 'uuid',
    },
    user: {
      type: 'uuid',
    },
    state: {
      type: 'mixed',
    },
  },
};
