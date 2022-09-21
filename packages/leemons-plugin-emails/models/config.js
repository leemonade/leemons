module.exports = {
  modelName: 'config',
  collectionName: 'config',
  options: {
    useTimestamps: true,
  },
  attributes: {
    userAgent: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    key: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    value: {
      type: 'string',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
// -- Keys --
// disable-all-activity-emails
// new-assignation-email
// week-resume-email
// new-assignation-per-day-email
// new-assignation-timeout-email
