module.exports = {
  modelName: 'assets',
  collectionName: 'assets',
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
    tagline: {
      type: 'string',
    },
    description: {
      type: 'richtext',
    },
    color: {
      type: 'string',
    },
    cover: {
      type: 'uuid',
    },
    fromUser: {
      references: {
        collection: 'plugins_users::users',
      },
    },
    fromUserAgent: {
      references: {
        collection: 'plugins_users::user-agent',
      },
    },
    public: {
      type: 'boolean',
    },
    category: {
      references: {
        collection: 'plugins_leebrary::categories',
      },
    },
    indexable: {
      type: 'boolean',
      options: {
        defaultTo: true,
      },
    },
    center: {
      type: 'uuid',
    },
    program: {
      type: 'uuid',
    },
  },
  primaryKey: {
    specificType: 'varchar(255)',
  },
};
