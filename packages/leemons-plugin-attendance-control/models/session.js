module.exports = {
  modelName: 'session',
  collectionName: 'session',
  options: {
    useTimestamps: true,
  },
  attributes: {
    name: {
      type: 'string',
    },
    date: {
      type: 'datetime',
    },
    class: {
      type: 'string',
      /*
      references: {
        collection: 'plugins_academic-portfolio::class',
      },
      */
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
