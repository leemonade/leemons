module.exports = {
  modelName: 'node-levels',
  collectionName: 'node-levels',
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
    listType: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    levelOrder: {
      type: 'integer',
      options: {
        notNull: true,
      },
    },
    curriculum: {
      type: 'string',
      /*
      references: {
        collection: 'plugins_curriculum::curriculums',
      },
       */
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
