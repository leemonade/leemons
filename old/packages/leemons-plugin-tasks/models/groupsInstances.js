module.exports = {
  modelName: 'groupsInstances',
  attributes: {
    group: {
      type: 'string',
    },
    instance: {
      type: 'uuid',
    },
    student: {
      type: 'uuid',
    },
  },
};
