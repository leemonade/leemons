const { LeemonsValidator } = require('@leemons/validator');

const _ = require('lodash');

const instanceValidationObject = {
  type: 'object',
  properties: {
    assignable: {
      type: 'string',
      minLength: 36,
      maxLength: 255,
    },
    isAllDay: {
      type: 'boolean',
    },
    alwaysAvailable: {
      type: 'boolean',
    },
    dates: {
      type: 'object',
      patternProperties: {
        '^.*$': {
          oneOf: [
            {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            {
              instanceof: 'Date',
            },
            {
              type: 'number',
            },
          ],
        },
      },
    },
    duration: {
      type: 'string',
      nullable: true,
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
    classes: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    sendMail: {
      type: 'boolean',
      nullable: true,
    },
    messageToAssignees: {
      type: 'string',
      nullable: true,
      maxLength: 16777215,
    },
    curriculum: {
      type: 'object',
      properties: {
        content: {
          type: 'boolean',
        },
        assessmentCriteria: {
          type: 'boolean',
        },
        objectives: {
          type: 'boolean',
        },
      },
    },
    addNewClassStudents: {
      type: 'boolean',
    },
    metadata: {
      type: 'object',
    },
  },
};

const instanceRequiredProperties = [
  'assignable',
  'alwaysAvailable',
  'dates',
  'gradable',
  'requiresScoring',
  'allowFeedback',
];

function validateInstance({ assignable, useRequired = false }) {
  const obj = _.clone(instanceValidationObject);

  if (useRequired) {
    obj.required = instanceRequiredProperties;
  }

  const validator = new LeemonsValidator(obj);

  if (!validator.validate(assignable)) {
    throw validator.error;
  }
}

module.exports = {
  instanceValidationObject,
  instanceRequiredProperties,
  validateInstance,
};
