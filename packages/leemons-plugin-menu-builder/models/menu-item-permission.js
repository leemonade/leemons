module.exports = {
  modelName: 'menu-item-permission',
  collectionName: 'menu-item-permission',
  options: {
    useTimestamps: true,
  },
  attributes: {
    menuItem: {
      references: {
        collection: 'plugins_menu-builder::menu-item',
      },
    },
    permissionName: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    actionName: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    target: {
      type: 'string',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
