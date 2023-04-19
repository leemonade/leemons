module.exports = {
  modelName: 'message-config-programs',
  collectionName: 'message-config-programs',
  options: {
    useTimestamps: true,
  },
  attributes: {
    messageConfig: {
      references: {
        collection: 'plugins_board-messages::message-config',
      },
    },
    program: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
