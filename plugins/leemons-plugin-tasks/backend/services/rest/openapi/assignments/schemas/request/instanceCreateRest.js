// automatic hash: 6b4d0e159a84e76097bbe7ca710b66983748a223799903a9dd4d52785b4501bf
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    students: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
    classes: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
    addNewClassStudents: {
      type: 'boolean',
    },
    alwaysAvailable: {
      type: 'boolean',
    },
    dates: {
      type: 'object',
      properties: {
        visualization: {
          type: 'string',
          minLength: 1,
        },
      },
      required: ['visualization'],
    },
    duration: {
      type: 'string',
      minLength: 1,
    },
    gradable: {
      type: 'boolean',
    },
    requiresScoring: {
      type: 'boolean',
    },
    allowFeedback: {
      type: 'boolean',
    },
    curriculum: {
      type: 'object',
      properties: {
        custom: {
          type: 'boolean',
        },
      },
      required: ['custom'],
    },
    sendMail: {
      type: 'boolean',
    },
    messageToAssignees: {
      type: 'string',
      minLength: 1,
    },
    showResults: {
      type: 'boolean',
    },
    showCorrectAnswers: {
      type: 'boolean',
    },
    metadata: {
      type: 'object',
      properties: {
        evaluationType: {
          type: 'string',
          minLength: 1,
        },
      },
      required: ['evaluationType'],
    },
    task: {
      type: 'string',
      minLength: 1,
    },
  },
  required: [
    'students',
    'classes',
    'addNewClassStudents',
    'alwaysAvailable',
    'dates',
    'duration',
    'gradable',
    'requiresScoring',
    'allowFeedback',
    'curriculum',
    'sendMail',
    'messageToAssignees',
    'showResults',
    'showCorrectAnswers',
    'metadata',
    'task',
  ],
};

module.exports = { schema };
