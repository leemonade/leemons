module.exports = {
  modelName: 'feedback-responses',
  collectionName: 'feedback-responses',
  options: {
    useTimestamps: true,
  },
  attributes: {
    assignable: {
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
    response: { type: ['string', 'int'] },
  },
  primaryKey: {
    type: 'uuid',
  },
};
