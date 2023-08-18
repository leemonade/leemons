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
    cover: {
      type: ['object', 'string'],
      nullable: true,
    },
    state: textSchemaNullable,
    program: stringSchemaNullable,
    categories: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['value'],
        properties: {
          id: stringSchema,
          value: stringSchema,
        },
      },
    },
    subjects: {
      type: 'array',
      items: stringSchema,
    },
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
          id: stringSchema,
          type: stringSchema,
          level: stringSchemaNullable,
          category: {
            type: ['string', 'number'],
            minLength: 1,
            maxLength: 255,
            nullable: true,
          },
          withImages: {
            type: ['boolean', 'number'],
            nullable: true,
          },
          tags: {
            type: 'array',
            items: stringSchema,
            nullable: true,
          },
          question: textSchema,
          questionImage: {
            type: ['object', 'string'],
            nullable: true,
          },
          questionImageDescription: stringSchemaNullable,
          properties: {
            type: 'object',
            additionalProperties: true,
          },
          clues: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                value: textSchema,
              },
            },
            nullable: true,
          },
        },
      },
    },
  },
  required: ['name'],
  additionalProperties: false,
};

function validateSaveQuestionBank(data) {
  const schema = _.cloneDeep(saveQuestionBankSchema);
  if (data.published) {
    schema.required = ['name', 'questions']; // 'program', 'subjects'
    schema.properties.questions.items.required = ['type', 'question'];
  }
  const validator = new LeemonsValidator(schema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

const saveTestSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    name: stringSchema,
    type: stringSchemaNullable,
    tagline: stringSchemaNullable,
    color: stringSchemaNullable,
    cover: {
      type: ['object', 'string'],
      nullable: true,
    },
    description: textSchemaNullable,
    tags: {
      type: 'array',
      items: stringSchema,
    },
    level: stringSchemaNullable,
    gradable: booleanSchema,
    statement: textSchemaNullable,
    instructionsForTeachers: textSchemaNullable,
    instructionsForStudents: textSchemaNullable,
    questionBank: stringSchemaNullable,
    program: stringSchemaNullable,
    curriculum: {
      type: 'object',
      additionalProperties: true,
      nullable: true,
    },
    subjects: {
      type: 'array',
      items: stringSchema,
    },
    filters: {
      type: 'object',
      additionalProperties: true,
      nullable: true,
    },
    questions: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    published: booleanSchema,
  },
  required: ['name'],
  additionalProperties: false,
};

function validateSaveTest(data) {
  const schema = _.cloneDeep(saveTestSchema);
  if (data.published) {
    schema.required = ['name', 'type', 'questionBank', 'questions', 'statement'];
  }
  const validator = new LeemonsValidator(schema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

module.exports = {
  validateSaveQuestionBank,
  validateSaveTest,
};
