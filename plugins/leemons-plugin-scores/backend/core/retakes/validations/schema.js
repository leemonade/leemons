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

const retakeScoreSchema = {
  type: 'object',
  properties: {
    retakeId: { type: 'string', format: 'lrn', nullable: true },
    retakeIndex: { type: 'number', minimum: 0 },
    class: { type: 'string', format: 'lrn' },
    period: {
      oneOf: [
        { type: 'string', format: 'lrn' },
        { type: 'string', enum: ['fullCourse'] },
      ],
    },
    user: { type: 'string', format: 'lrn' },
    grade: { type: 'number' },
  },
  required: ['retakeId', 'retakeIndex', 'class', 'period', 'user', 'grade'],
  additionalProperties: false,
};

module.exports = { retakeSchema, retakeScoreSchema };
