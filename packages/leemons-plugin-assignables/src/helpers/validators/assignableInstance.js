const _ = require('lodash');

const assignableInstanceValidationObject = {
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
        format: 'uuid',
      },
    },
    messageToAssignees: {
      type: 'string',
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

const assignableInstanceRequiredProperties = [
  'assignable',
  'alwaysAvailable',
  'dates',
  'gradable',
  'requiresScoring',
  'allowFeedback',
];

function validateAssignableInstance(assignable, { useRequired = false } = {}) {
  const obj = _.clone(assignableInstanceValidationObject);

  if (useRequired) {
    obj.required = assignableInstanceRequiredProperties;
  }

  const validator = new global.utils.LeemonsValidator(obj);

  if (!validator.validate(assignable)) {
    throw validator.error;
  }
}

module.exports = {
  assignableInstanceValidationObject,
  assignableInstanceRequiredProperties,
  validateAssignableInstance,
};
