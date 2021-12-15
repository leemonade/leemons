module.exports = {
  modelName: 'nodes',
  collectionName: 'nodes',
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
    fullName: {
      type: 'string',
    },
    // ES: Orden dentro del mismo padre
    // EN: Order inside the same parent
    nodeOrder: {
      type: 'integer',
      options: {
        notNull: true,
      },
    },
    parentNode: {
      references: {
        collection: 'plugins_curriculum::nodes',
      },
    },
    nodeLevel: {
      references: {
        collection: 'plugins_curriculum::node-levels',
      },
    },
    curriculum: {
      references: {
        collection: 'plugins_curriculum::curriculums',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
