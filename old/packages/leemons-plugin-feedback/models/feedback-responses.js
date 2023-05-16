module.exports = {
  modelName: 'feedback-responses',
  collectionName: 'feedback-responses',
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
    userAgent: {
      type: 'string',
      /*
      references: {
        collection: 'plugins_users::user-agent',
      },
      */
    },
    question: {
      type: 'string',
      references: {
        collection: 'plugins_feedback::feedback-questions',
      },
    },
    response: {
      type: 'text',
      textType: 'mediumText',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
