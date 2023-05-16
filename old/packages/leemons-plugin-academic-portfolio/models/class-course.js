module.exports = {
  modelName: 'class-course',
  collectionName: 'class-course',
  options: {
    useTimestamps: true,
  },
  attributes: {
    class: {
      references: {
        collection: 'plugins_academic-portfolio::class',
      },
    },
    course: {
      references: {
        collection: 'plugins_academic-portfolio::groups',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
