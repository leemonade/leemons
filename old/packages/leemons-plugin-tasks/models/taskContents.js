module.exports = {
  modelName: 'taskContents',
  attributes: {
    task: {
      type: 'string',
    },
    content: {
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
