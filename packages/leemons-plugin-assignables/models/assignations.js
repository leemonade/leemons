module.exports = {
  modelName: 'assignations',
  attributes: {
    instance: {
      type: 'uuid',
      options: {
        notNull: true,
      },
    },
    indexable: {
      type: 'boolean',
      options: {
        notNull: true,
      },
    },
    user: {
      type: 'uuid',
      options: {
        notNull: true,
      },
    },
    classes: {
      type: 'json',
      options: {
        notNull: true,
      },
    },
    group: {
      type: 'string',
    },
    status: {
      type: 'string',
    },
    metadata: {
      type: 'json',
    },
    emailSended: {
      type: 'boolean',
    },
  },
  primaryKey: {
    name: 'id',
    type: 'uuid',
  },
};
