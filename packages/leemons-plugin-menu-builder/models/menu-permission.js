module.exports = {
  modelName: 'menu-permission',
  collectionName: 'menu-permission',
  options: {
    useTimestamps: true,
  },
  attributes: {
    menu: {
      references: {
        collection: 'plugins_menu-builder::menu',
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
