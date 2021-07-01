module.exports = {
  modelName: 'menu-item',
  collectionName: 'menu-item',
  options: {
    useTimestamps: true,
  },
  attributes: {
    menu: {
      references: {
        collection: 'plugins_menu-builder::menu',
      },
    },
    parent: {
      references: {
        collection: 'plugins_menu-builder::menu-item',
      },
      options: {
        notNull: false,
      },
    },
    pluginName: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    name: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    slug: {
      type: 'string',
      options: {
        unique: true,
        notNull: true,
      },
    },
    order: {
      type: 'integer',
      options: {
        notNull: false,
      },
    },
    fixed: {
      type: 'boolean',
      options: {
        defaultTo: false,
      },
    },
    iconName: {
      type: 'string',
      options: {
        notNull: false,
      },
    },
    iconSvg: {
      type: 'richtext',
      textType: 'text',
      options: {
        notNull: false,
      },
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
