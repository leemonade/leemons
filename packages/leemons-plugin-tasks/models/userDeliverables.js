module.exports = {
  modelName: 'userDeliverables',
  attributes: {
    instance: {
      type: 'uuid',
    },
    user: {
      type: 'uuid',
    },
    deliverable: {
      type: 'json',
    },
    type: {
      type: 'string',
    },
  },
};
