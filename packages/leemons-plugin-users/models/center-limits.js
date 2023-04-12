module.exports = {
  modelName: 'center-limits',
  collectionName: 'center-limits',
  options: {
    useTimestamps: true,
  },
  attributes: {
    center: {
      references: {
        collection: 'plugins_users::centers',
      },
    },
    // group / profile
    type: {
      type: 'string',
    },
    item: {
      type: 'string',
    },
    unlimited: {
      type: 'boolean',
    },
    limit: {
      type: 'integer',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
