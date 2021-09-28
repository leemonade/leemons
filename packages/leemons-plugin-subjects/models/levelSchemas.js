module.exports = {
  modelName: 'levelSchemas',
  options: {
    useTimestamps: true,
  },
  attributes: {
    parent: {
      references: {
        collection: 'plugins_subjects::levelSchemas',
      },
      options: {
        unique: false,
      },
    },
    isSubject: {
      type: 'boolean',
      options: {
        notNull: true,
      },
    },
    credits: {
      type: 'string',
      length: 16,
    },
    visualIdentification: {
      type: 'string',
      length: 16,
    },
    properties: {
      type: 'json',
    },

    teaching: {
      references: {
        collection: 'plugins_subjects::teachingItems',
        relation: 'many to many',
      },
    },

    hours: {
      references: {
        collection: 'plugins_subjects::teachingItems',
        relation: 'many to many',
      },
    },
    types: {
      references: {
        collection: 'plugins_subjects::typesItems',
        relation: 'many to many',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
