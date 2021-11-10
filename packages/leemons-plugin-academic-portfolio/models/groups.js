module.exports = {
  modelName: 'groups',
  collectionName: 'groups',
  options: {
    useTimestamps: true,
  },
  attributes: {
    name: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    abbreviation: {
      type: 'string',
    },
    index: {
      type: 'integer',
    },
    program: {
      references: {
        collection: 'plugins_academic-portfolio::programs',
      },
    },
    // course / group / substage
    type: {
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
