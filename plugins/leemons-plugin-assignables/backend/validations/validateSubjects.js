const { LeemonsValidator } = require('leemons-validator');

const subjectsValidationObject = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      program: {
        type: 'string',
      },
      subject: {
        type: 'string',
      },
      level: {
        type: 'string',
        maxLength: 255,
        nullable: true,
      },
      curriculum: {
        type: ['object', 'array'],
        nullable: true,
      },
    },
  },
};

function validateSubjects(subjects) {
  const validator = new LeemonsValidator(subjectsValidationObject, { allowUnionTypes: true });

  if (!validator.validate(subjects)) {
    throw validator.error;
  }
}

module.exports = {
  subjectsValidationObject,
  validateSubjects,
};
