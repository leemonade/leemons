module.exports = {
  modelName: 'assignables',
  attributes: {
    asset: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    role: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    gradable: {
      type: 'boolean',
      options: {
        notNull: true,
      },
    },
    program: {
      type: 'uuid',
    },
    methodology: {
      type: 'string',
    },
    statement: {
      type: 'richtext',
    },
    development: {
      type: 'richtext',
    },
    duration: {
      type: 'string',
    },
    // attachments
    submission: {
      type: 'json',
    },
    instructionsForTeachers: {
      type: 'richtext',
    },
    instructionsForStudents: {
      type: 'richtext',
    },
    metadata: {
      type: 'json',
    },
  },
  primaryKey: {
    name: 'id',
    specificType: 'varchar(255)',
  },
};
