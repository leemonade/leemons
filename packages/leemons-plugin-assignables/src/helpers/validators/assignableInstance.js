const assignableInstanceValidationObject = {
  type: 'object',
  properties: {
    assignable: {
      type: 'string',
      minLength: 36,
      maxLength: 255,
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
            },
            {
              instanceof: 'Date',
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
    metadata: {
      type: 'object',
    },
  },
};

const assignableInstanceRequiredProperties = ['assignable', 'alwaysAvailable', 'dates', 'gradable'];

function validateAssignableInstance(assignable, { useRequired = false } = {}) {
  const obj = assignableInstanceValidationObject;

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
