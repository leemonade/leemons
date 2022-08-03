module.exports = {
  modelName: 'dates',
  attributes: {
    type: {
      type: 'string',
    },
    // If type == assignableInstance then instance is the assignableInstanceId
    // If type == assignation then instance is the assignationId
    instance: {
      type: 'string',
    },
    // type == assignation -> end, open, start
    // type == assignableInstance -> deadline
    name: {
      type: 'string',
    },
    date: {
      type: 'datetime',
    },
  },
};
