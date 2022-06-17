const subjectsValidationObject = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      program: {
        type: 'string',
        format: 'uuid',
      },
      subject: {
        type: 'string',
        format: 'uuid',
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
  const validator = new global.utils.LeemonsValidator(subjectsValidationObject);

  if (!validator.validate(subjects)) {
    throw validator.error;
  }
}

module.exports = {
  subjectsValidationObject,
  validateSubjects,
};
