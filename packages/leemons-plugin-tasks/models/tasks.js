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
    recommendedDuration: {
      type: 'number',
    },
    statement: {
      type: 'richtext',
    },
    development: {
      type: 'richtext',
    },
    submissions: {
      type: 'boolean',
    },
    selfReflection: {
      type: 'boolean',
    },
    feedback: {
      type: 'boolean',
    },
    instructionsForTeacher: {
      type: 'richtext',
    },
    instructionsForStudent: {
      type: 'richtext',
    },
    // Track the current state, including setup steps
    state: {
      type: 'string',
    },
  },
};
