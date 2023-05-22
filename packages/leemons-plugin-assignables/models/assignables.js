module.exports = {
  modelName: 'assignables',
  options: {
    useTimestamps: true,
  },
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
      type: 'text',
      textType: 'mediumText',
    },
    submission: {
      type: 'text',
      textType: 'mediumText',
    },
    instructionsForTeachers: {
      type: 'richtext',
    },
    relatedAssignables: {
      type: 'text',
      textType: 'mediumText',
    },
    instructionsForStudents: {
      type: 'richtext',
    },
    metadata: {
      type: 'text',
      textType: 'mediumText',
    },
  },
  primaryKey: {
    name: 'id',
    specificType: 'varchar(255)',
  },
};
