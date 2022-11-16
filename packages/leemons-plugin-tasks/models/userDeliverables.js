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
      type: 'text',
      textType: 'mediumText',
    },
    type: {
      type: 'string',
    },
  },
};
