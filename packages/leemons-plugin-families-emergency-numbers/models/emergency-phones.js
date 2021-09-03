module.exports = {
  modelName: 'emergency-phones',
  collectionName: 'emergency-phones',
  options: {
    useTimestamps: true,
  },
  attributes: {
    family: {
      references: {
        collection: 'plugins_families::families',
      },
    },
    name: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    phone: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    relation: {
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
