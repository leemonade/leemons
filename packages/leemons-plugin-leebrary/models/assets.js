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
      references: {
        collection: 'plugins_leebrary::files',
      },
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
  },
  primaryKey: {
    specificType: 'varchar(255)',
  },
};
