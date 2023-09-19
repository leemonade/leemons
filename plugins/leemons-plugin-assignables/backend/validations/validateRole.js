const { LeemonsValidator } = require('@leemons/validator');

// AJV Validator
const roleValidationObject = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    teacherDetailUrl: {
      type: 'string',
      minLength: 2,
    },
    studentDetailUrl: {
      type: 'string',
      minLength: 2,
    },
    evaluationDetailUrl: {
      type: 'string',
      minLength: 2,
    },
    dashboardUrl: {
      type: 'string',
      minLength: 2,
    },
    previewUrl: {
      type: 'string',
      minLength: 2,
    },
    plugin: {
      type: 'string',
      minLength: 1,
    },
    icon: {
      type: 'string',
      minLength: 2,
    },
  },
  required: ['name', 'teacherDetailUrl', 'studentDetailUrl', 'evaluationDetailUrl', 'plugin'],
  additionalProperties: false,
};

function validateRole(role) {
  const validator = new LeemonsValidator(roleValidationObject, { allowUnionTypes: true });

  if (!validator.validate(role)) {
    throw validator.error;
  }
}

module.exports = {
  roleValidationObject,
  validateRole,
};
