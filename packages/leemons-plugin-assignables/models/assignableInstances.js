module.exports = {
  modelName: 'assignableInstances',
  attributes: {
    assignable: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    alwaysAvailable: {
      type: 'boolean',
      options: {
        notNull: true,
      },
    },
    duration: {
      type: 'string',
    },
    gradable: {
      type: 'boolean',
      options: {
        notNull: true,
      },
    },
    messageToAssignees: {
      type: 'richtext',
    },
    curriculum: {
      type: 'json',
    },
    metadata: {
      type: 'json',
    },
    relatedAssignableInstances: {
      type: 'json',
    },
    event: {
      references: {
        collection: 'plugins_calendar::events',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
    name: 'id',
  },
};
