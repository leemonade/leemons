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
    activeIconName: {
      type: 'string',
    },
    iconSvg: {
      type: 'string',
    },
    activeIconSvg: {
      type: 'string',
    },
    iconAlt: {
      type: 'string',
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
    disabled: {
      type: 'boolean',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
