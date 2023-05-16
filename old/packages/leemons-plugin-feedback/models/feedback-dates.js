module.exports = {
  modelName: 'feedback-dates',
  collectionName: 'feedback-dates',
  options: {
    useTimestamps: true,
  },
  attributes: {
    instance: {
      type: 'string',
    },
    startDate: {
      type: 'datetime',
    },
    endDate: {
      type: 'datetime',
    },
    timeToFinish: {
      type: 'integer',
    },
    userAgent: {
      type: 'string',
      /*
      references: {
        collection: 'plugins_users::user-agent',
      },
      */
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
