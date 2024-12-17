const retakeSchema = {
  type: 'object',
  properties: {
    classId: {
      type: 'string',
      format: 'lrn',
    },
    period: {
      oneOf: [
        { type: 'string', format: 'lrn' },
        { type: 'string', enum: ['fullCourse'] },
      ],
    },
  },
  required: ['classId', 'period'],
  additionalProperties: false,
};

module.exports = { retakeSchema };
