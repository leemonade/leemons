module.exports = {
  modelName: 'tasks',
  attributes: {
    tagline: {
      type: 'string',
    },
    level: {
      type: 'string',
    },
    summary: {
      type: 'richtext',
    },
    cover: {
      type: 'string',
    },
    // TODO: Add cover cropping
    color: {
      type: 'string',
    },
    methodology: {
      type: 'string',
    },
    // TODO: Move to string (20min | 20years), because if not, it can overflow
    recommendedDuration: {
      type: 'integer',
    },
    statement: {
      type: 'richtext',
    },
    development: {
      type: 'richtext',
    },
    submissions: {
      type: 'json',
    },
    preTask: {
      type: 'string',
    },
    preTaskOptions: {
      type: 'json',
    },
    selfReflection: {
      type: 'json',
    },
    feedback: {
      type: 'json',
    },
    instructionsForTeacher: {
      type: 'richtext',
    },
    instructionsForStudent: {
      type: 'richtext',
    },
    center: {
      type: 'uuid',
    },
    program: {
      type: 'uuid',
    },
    // Track the current state, including setup steps
    state: {
      type: 'string',
    },
    published: {
      type: 'boolean',
      options: {
        defaultTo: false,
      },
    },
  },
  primaryKey: {
    specificType: 'varchar(255)',
  },
};
