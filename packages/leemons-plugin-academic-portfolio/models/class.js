module.exports = {
  modelName: 'class',
  collectionName: 'class',
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
    inheritFromGroup: {
      type: 'boolean',
      options: {
        defaultTo: false,
      },
    },
    subject: {
      references: {
        collection: 'plugins_academic-portfolio::subjects',
      },
    },
    class: {
      references: {
        collection: 'plugins_academic-portfolio::class',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
