module.exports = {
  modelName: 'categories',
  collectionName: 'categories',
  attributes: {
    key: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    pluginOwner: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    creatable: {
      type: 'boolean',
      options: {
        defaultTo: false,
      },
    },
    createUrl: { type: 'string' },
    duplicable: {
      type: 'boolean',
      options: {
        defaultTo: false,
      },
    },
    provider: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    componentOwner: { type: 'string' },
    listCardComponent: { type: 'string' },
    listItemComponent: { type: 'string' },
    detailComponent: { type: 'string' },
    canUse: {
      type: 'text',
      textType: 'mediumText',
    },
    order: {
      type: 'integer',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
