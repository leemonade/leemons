const manualActivitySchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    date: {
      type: 'string',
      format: 'date-time',
    },
    type: {
      type: 'string',
      // enum: ['task', 'test'], // This comes from assignables, so we don't check it, once assignables exposes it, we can check it
    },
    classId: {
      type: 'string',
      format: 'lrn',
    },
  },
  required: ['name', 'date', 'type', 'classId'],
  additionalProperties: false,
};

module.exports = manualActivitySchema;
