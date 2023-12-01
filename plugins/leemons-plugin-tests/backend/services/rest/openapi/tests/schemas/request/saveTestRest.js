// automatic hash: d280b8f030a1d1a190a1551ec10be5e06359a110fb8f4dd25980cf6476f259f2
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      minLength: 1,
    },
    name: {
      type: 'string',
      minLength: 1,
    },
    tagline: {
      type: 'string',
      minLength: 1,
    },
    color: {
      type: 'string',
      minLength: 1,
    },
    tags: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
    program: {
      type: 'string',
      minLength: 1,
    },
    statement: {
      type: 'string',
      minLength: 1,
    },
    gradable: {
      type: 'boolean',
    },
    questionBank: {
      type: 'string',
      minLength: 1,
    },
    filters: {
      type: 'object',
      properties: {
        useAllQuestions: {
          type: 'boolean',
        },
      },
      required: ['useAllQuestions'],
    },
    questions: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
    type: {
      type: 'string',
      minLength: 1,
    },
    levels: {},
    curriculum: {
      type: 'object',
      properties: {},
      required: [],
    },
    subjects: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
    published: {
      type: 'boolean',
    },
  },
  required: [
    'id',
    'name',
    'tagline',
    'color',
    'tags',
    'program',
    'statement',
    'gradable',
    'questionBank',
    'filters',
    'questions',
    'type',
    'curriculum',
    'subjects',
    'published',
  ],
};

module.exports = { schema };
