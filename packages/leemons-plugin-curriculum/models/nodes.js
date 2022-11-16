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
    nameOrder: {
      type: 'string',
    },
    academicItem: {
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
      type: 'string',
      /*
      references: {
        collection: 'plugins_curriculum::nodes',
      },
      */
    },
    nodeLevel: {
      type: 'string',
      /*
      references: {
        collection: 'plugins_curriculum::node-levels',
      },
      */
    },
    curriculum: {
      type: 'string',
      /*
      references: {
        collection: 'plugins_curriculum::curriculums',
      },
       */
    },
    treeId: {
      type: 'text',
    },
    data: {
      type: 'text',
      textType: 'mediumText',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
