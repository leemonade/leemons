module.exports = {
  modelName: 'levelSchemas',
  options: {
    useTimestamps: true,
  },
  attributes: {
    parent: {
      references: {
        collection: 'plugins_classroom::levelSchemas',
      },
      options: {
        unique: false,
      },
    },
    isClass: {
      type: 'boolean',
      options: {
        notNull: true,
      },
    },
    assignableProfiles: {
      references: {
        collection: 'plugins_users::profiles',
        relation: 'many to many',
      },
    },
    properties: {
      type: 'json',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
