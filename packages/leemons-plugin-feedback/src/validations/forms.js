const _ = require('lodash');

const { LeemonsValidator } = global.utils;
const {
  stringSchema,
  booleanSchema,
  stringSchemaNullable,
  textSchemaNullable,
  textSchema,
} = require('./types');

const saveQuestionBankSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    name: stringSchema,
    tagline: stringSchemaNullable,
    description: textSchemaNullable,
    color: stringSchemaNullable,
    tags: {
      type: 'array',
      items: stringSchema,
    },
    cover: {
      type: ['object', 'string'],
      nullable: true,
    },
    featuredImage: {
      type: ['object', 'string'],
      nullable: true,
    },
    introductoryText: textSchema,
    published: booleanSchema,
    questions: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: [],
        properties: {
          id: stringSchema,
          type: stringSchema,
          question: textSchema,
          required: booleanSchema,
          properties: {
            type: 'object',
            additionalProperties: true,
          },
        },
      },
    },
  },
  required: ['name'],
  additionalProperties: false,
};

function validateSaveFeedback(data) {
  const schema = _.cloneDeep(saveQuestionBankSchema);
  if (data.published) {
    schema.required = ['name', 'questions', 'introductoryText'];
    schema.properties.questions.items.required = ['type', 'question'];
  }
  const validator = new LeemonsValidator(schema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

module.exports = {
  validateSaveFeedback,
};
