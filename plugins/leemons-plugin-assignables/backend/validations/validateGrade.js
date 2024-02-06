const { LeemonsValidator } = require('@leemons/validator');

// AJV Validator
const gradeValidationObject = {
  type: 'object',
  properties: {
    assignation: {
      type: 'string',
    },
    subject: {
      type: 'string',
    },
    type: {
      type: 'string',
    },
    grade: {
      type: ['number', 'null'],
    },
    gradedBy: {
      type: 'string',
    },
    feedback: {
      type: 'string',
      nullable: true,
    },
    visibleToStudent: {
      type: 'boolean',
    },
  },
  required: ['assignation', 'subject', 'type', 'grade', 'gradedBy', 'visibleToStudent'],
  additionalProperties: false,
};

function validateGrade(grade) {
  const validator = new LeemonsValidator(gradeValidationObject, {
    allowUnionTypes: true,
  });

  if (!validator.validate(grade)) {
    throw validator.error;
  }
}

module.exports = {
  gradeValidationObject,
  validateGrade,
};
