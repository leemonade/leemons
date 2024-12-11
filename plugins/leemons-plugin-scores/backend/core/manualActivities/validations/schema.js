const manualActivitySchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    description: {
      type: 'string',
    },
    date: {
      type: 'string',
      format: 'date-time',
    },
    role: {
      type: 'string',
      minLength: 1,
      // enum: ['task', 'test'], // This comes from assignables, so we don't check it, once assignables exposes it, we can check it
    },
    classId: {
      type: 'string',
      format: 'lrn',
    },
  },
  required: ['name', 'date', 'role', 'classId'],
  additionalProperties: false,
};

const scoresSchema = {
  type: 'object',
  properties: {
    user: {
      type: 'string',
      format: 'lrn',
    },
    activity: {
      type: 'string',
      format: 'lrn',
    },
    grade: {
      type: 'number',
    },
    class: {
      type: 'string',
      format: 'lrn',
    },
  },
  required: ['user', 'activity', 'grade', 'class'],
  additionalProperties: false,
};

module.exports = { manualActivitySchema, scoresSchema };
