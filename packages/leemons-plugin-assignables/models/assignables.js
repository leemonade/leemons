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
    center: {
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
    resources: {
      type: 'json',
    },
    submission: {
      type: 'json',
    },
    instructionsForTeachers: {
      type: 'richtext',
    },
    relatedAssignables: {
      type: 'json',
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
