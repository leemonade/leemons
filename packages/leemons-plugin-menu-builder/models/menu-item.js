module.exports = {
  modelName: 'menu-item',
  collectionName: 'menu-item',
  options: {
    useTimestamps: true,
  },
  attributes: {
    menuKey: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    key: {
      type: 'string',
      options: {
        unique: true,
        notNull: true,
      },
    },
    parentKey: {
      type: 'string',
    },
    pluginName: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    order: {
      type: 'integer',
    },
    fixed: {
      type: 'boolean',
      options: {
        defaultTo: false,
      },
    },
    iconName: {
      type: 'string',
    },
    iconSvg: {
      type: 'richtext',
      textType: 'text',
    },
    url: {
      type: 'string',
      options: {
        notNull: false,
      },
    },
    window: {
      type: 'string',
      options: {
        defaultTo: 'SELF', // SELF, BLANK, MODAL
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
