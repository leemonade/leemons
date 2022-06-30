module.exports = {
  modelName: 'grades',
  collectionName: 'grades',
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
    type: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    isPercentage: {
      type: 'boolean',
      options: {
        defaultTo: false,
      },
    },
    minScaleToPromote: {
      references: {
        collection: 'plugins_grades::grade-scales',
      },
    },
    center: {
      references: {
        collection: 'plugins_users::centers',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
