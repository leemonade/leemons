module.exports = {
  modelName: 'assistance',
  collectionName: 'assistance',
  options: {
    useTimestamps: true,
  },
  attributes: {
    student: {
      type: 'string',
      /*
      references: {
        collection: 'plugins_users::user-agent',
      },
      */
    },
    session: {
      type: 'string',
      /*
      references: {
        collection: 'plugins_attendance-control::session',
      },
      */
    },
    // on-time / late / not
    assistance: {
      type: 'string',
    },
    comment: {
      type: 'text',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
