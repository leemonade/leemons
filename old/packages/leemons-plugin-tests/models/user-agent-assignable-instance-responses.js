module.exports = {
  modelName: 'user-agent-assignable-instance-responses',
  collectionName: 'user-agent-assignable-instance-responses',
  options: {
    useTimestamps: true,
  },
  attributes: {
    instance: {
      type: 'string',
      /*
      references: {
        collection: 'plugins_assignables::assignableInstances',
      },
      */
    },
    question: {
      references: {
        collection: 'plugins_tests::questions',
      },
    },
    userAgent: {
      type: 'string',
      /*
      references: {
        collection: 'plugins_users::user-agent',
      },
      */
    },
    clues: {
      type: 'integer',
    },
    // ok | ko | null
    status: {
      type: 'string',
    },
    points: {
      type: 'float',
    },
    properties: {
      type: 'text',
      textType: 'mediumText',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
