const _ = require('lodash');

const { LeemonsValidator } = global.utils;
const { booleanSchemaNullable } = require('leemons-plugin-academic-calendar/src/validations/types');
const {
  stringSchema,
  booleanSchema,
  stringSchemaNullable,
  textSchemaNullable,
  textSchema,
  numberSchema,
  integerSchemaNullable,
} = require('./types');

const saveQuestionBankSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    name: stringSchema,
    tagline: stringSchemaNullable,
    description: textSchemaNullable,
    color: stringSchemaNullable,
    program: stringSchemaNullable,
    subjects: {
      nullable: true,
      type: 'array',
      items: {
        type: 'object',
        required: ['subject'],
        properties: {
          subject: stringSchema,
          level: stringSchemaNullable,
        },
      },
    },
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
    introductoryText: { type: 'string', nullable: true },
    thanksMessage: { type: 'string' },
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
          required: booleanSchemaNullable,
          order: integerSchemaNullable,
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
    schema.properties.thanksMessage = textSchema;
    schema.properties.introductoryText = textSchema;
    schema.required = ['name', 'questions', 'introductoryText', 'thanksMessage'];
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
