module.exports = {
  modelName: 'attachments',
  attributes: {
    task: {
      specificType: 'varchar(255)',
    },
    attachment: {
      type: 'uuid',
    },
  },
};
