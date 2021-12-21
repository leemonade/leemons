module.exports = {
  modelName: 'curriculums',
  collectionName: 'curriculums',
  options: {
    useTimestamps: true,
  },
  attributes: {
    name: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    description: {
      type: 'string',
    },
    country: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    locale: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    center: {
      references: {
        collection: 'plugins_users::centers',
      },
    },
    program: {
      references: {
        collection: 'plugins_academic-portfolio::programs',
      },
    },
    status: {
      type: 'string',
      enum: ['draft', 'published', 'archived'],
      options: {
        defaultTo: 'draft',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
