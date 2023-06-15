module.exports = {
  modelName: 'grade-scales',
  collectionName: 'grade-scales',
  options: {
    useTimestamps: true,
  },
  attributes: {
    number: {
      type: 'float',
      scale: 4,
      options: {
        notNull: true,
      },
    },
    description: {
      type: 'string',
    },
    letter: {
      type: 'string',
    },
    grade: {
      references: {
        collection: 'plugins_grades::grades',
      },
    },
    order: {
      type: 'integer',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
