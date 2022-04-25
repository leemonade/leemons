module.exports = {
  modelName: 'tests',
  collectionName: 'tests',
  options: {
    useTimestamps: true,
  },
  attributes: {
    name: {
      type: 'string',
    },
    questionBank: {
      type: 'string',
    },
    type: {
      type: 'string',
    },
    level: {
      type: 'string',
    },
    statement: {
      type: 'text',
    },
    instructionsForTeacher: {
      type: 'text',
    },
    instructionsForStudent: {
      type: 'text',
    },
    filters: {
      type: 'text',
    },
  },
  primaryKey: {
    name: 'id',
    specificType: 'varchar(255)',
  },
};
