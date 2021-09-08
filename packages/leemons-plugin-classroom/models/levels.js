module.exports = {
  modelName: 'levels',
  options: {
    useTimestamps: true,
  },
  attributes: {
    schema: {
      references: {
        collection: 'plugins_classroom::levelSchemas',
      },
      options: {
        unique: false,
        notNull: true,
      },
    },
    parent: {
      references: {
        collection: 'plugins_classroom::levels',
      },
      options: {
        unique: false,
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
