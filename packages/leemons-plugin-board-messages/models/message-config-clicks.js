module.exports = {
  modelName: 'message-config-clicks',
  collectionName: 'message-config-clicks',
  options: {
    useTimestamps: true,
  },
  attributes: {
    messageConfig: {
      references: {
        collection: 'plugins_board-messages::message-config',
      },
    },
    userAgent: {
      type: 'string',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
