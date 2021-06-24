module.exports = {
  modelName: 'datafield',
  collectionName: 'datafield',
  options: {
    useTimestamps: true,
  },
  attributes: {
    dataset: {
      references: {
        collection: 'plugins_dataset::dataset',
      },
    },
    label: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    type: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    placeholder: {
      type: 'string',
    },
    defaultValue: {
      type: 'string',
    },
    options: {
      type: 'string',
    },
    min: {
      type: 'number',
    },
    max: {
      type: 'number',
    },
    required: {
      type: 'boolean',
    },
    permissionName: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    plugin: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
