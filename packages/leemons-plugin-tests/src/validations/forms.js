const _ = require('lodash');

const { LeemonsValidator } = global.utils;
const { stringSchema, booleanSchema } = require('./types');

const saveQuestionBankSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    name: stringSchema,
    tagline: stringSchema,
    summary: stringSchema,
    tags: {
      type: 'array',
      items: stringSchema,
    },
    published: booleanSchema,
    questions: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: [],
        properties: {
          type: stringSchema,
          level: stringSchema,
          withImages: booleanSchema,
          tags: {
            type: 'array',
            items: stringSchema,
          },
          question: stringSchema,
          properties: {
            type: 'object',
            additionalProperties: true,
          },
          clues: {
            type: 'array',
            items: stringSchema,
          },
        },
      },
    },
  },
  required: [],
  additionalProperties: false,
};

function validateSaveQuestionBank(data) {
  const schema = _.cloneDeep(saveQuestionBankSchema);
  if (data.published) {
    schema.required = ['name', 'tagline', 'summary', 'questions'];
    schema.properties.questions.items.required = ['type', 'question'];
  }
  const validator = new LeemonsValidator(schema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

module.exports = {
  validateSaveQuestionBank,
};
