module.exports = {
  modelName: 'widget-item-profile',
  collectionName: 'widget-item-profile',
  options: {
    useTimestamps: true,
  },
  attributes: {
    zoneKey: {
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
    profile: {
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
