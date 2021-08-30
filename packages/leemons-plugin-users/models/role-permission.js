module.exports = {
  modelName: 'role-permission',
  collectionName: 'role-permission',
  options: {
    useTimestamps: true,
  },
  attributes: {
    role: {
      references: {
        collection: 'plugins_users::roles',
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
    isCustom: {
      type: 'boolean',
      options: {
        defaultTo: false,
        notNull: true,
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
