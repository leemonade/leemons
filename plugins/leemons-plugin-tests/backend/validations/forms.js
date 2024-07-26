const _ = require('lodash');

const { LeemonsValidator } = require('@leemons/validator');
const {
  stringSchema,
  booleanSchema,
  stringSchemaNullable,
  textSchemaNullable,
} = require('./types');

const formattedTextSchema = {
  type: 'object',
  properties: {
    text: stringSchema,
    format: stringSchema,
  },
};

const choiceSchema = {
  type: 'object',
  properties: {
    isCorrect: booleanSchema,
    text: {
      ...formattedTextSchema,
      nullable: true,
    },
    feedback: {
      ...formattedTextSchema,
      nullable: true,
    },
    hideOnHelp: booleanSchema,
    image: {
      type: ['object', 'string'],
      nullable: true,
    },
    imageDescription: stringSchemaNullable,
  },
  required: ['isCorrect'],
};

const mapMarkerSchema = {
  type: 'object',
  properties: {
    response: stringSchema,
    hideOnHelp: booleanSchema,
    left: stringSchema,
    top: stringSchema,
  },
  required: ['response', 'left', 'top'],
};

const markersSchema = {
  type: 'object',
  properties: {
    backgroundColor: stringSchema,
    type: {
      type: 'string',
      enum: ['numbering', 'letter'],
    },
    list: {
      type: 'array',
      items: mapMarkerSchema,
    },
    position: {
      type: 'object',
      properties: {
        left: stringSchema,
        top: stringSchema,
      },
      required: ['left', 'top'],
    },
  },
  required: ['backgroundColor', 'type', 'list', 'position'],
};

const mapPropertiesSchema = {
  type: 'object',
  properties: {
    image: {
      type: ['object', 'string'],
    },
    caption: stringSchemaNullable,
    markers: markersSchema,
  },
  required: ['image', 'markers'],
  nullable: true,
};

const questionTypes = ['mono-response', 'map'];
const questionTypeSchema = {
  type: 'string',
  enum: questionTypes,
};

const questionSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['type'],
  properties: {
    id: stringSchema,
    type: questionTypeSchema,
    level: stringSchemaNullable,
    category: {
      type: ['string', 'number'],
      minLength: 1,
      maxLength: 255,
      nullable: true,
    },
    hasImageAnswers: booleanSchema,
    tags: {
      type: 'array',
      items: stringSchema,
      nullable: true,
    },
    stem: {
      ...formattedTextSchema,
    },
    globalFeedback: {
      ...formattedTextSchema,
      nullable: true,
    },
    hasAnswerFeedback: booleanSchema,
    questionImage: {
      type: ['object', 'string'],
      nullable: true,
    },
    hasHelp: booleanSchema,
    clues: {
      type: 'array',
      items: {
        type: ['string'],
      },
      nullable: true,
    },

    // Validation by question type
    choices: {
      type: 'array',
      items: choiceSchema,
      nullable: true,
    },
    mapProperties: mapPropertiesSchema,
  },
};

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
        properties: {
          id: stringSchema,
          value: stringSchema,
        },
        required: ['value'],
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
      items: questionSchema,
    },
  },
  required: ['name'],
  additionalProperties: false,
};

function validateSaveQuestionBank(data) {
  const schema = _.cloneDeep(saveQuestionBankSchema);
  if (data.published) {
    schema.required = ['name', 'questions']; // 'program', 'subjects'
    schema.properties.questions.items.required = ['type', 'stem'];
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
    duration: stringSchemaNullable,
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
    resources: {
      type: 'array',
      items: stringSchema,
    },
    config: {
      type: 'object',
      additionalProperties: true,
      nullable: true,
    },
    published: booleanSchema,
  },
  required: ['name'],
  additionalProperties: true,
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
