module.exports = {
  modelName: 'managers',
  collectionName: 'managers',
  options: {
    useTimestamps: true,
  },
  attributes: {
    // Id of type
    relationship: {
      type: 'string',
    },
    // program | course | knowledge | etz
    type: {
      type: 'string',
    },
    userAgent: {
      references: {
        collection: 'plugins_users::user-agent',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
