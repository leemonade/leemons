const subjectsValidationObject = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      subject: {
        type: 'string',
        format: 'uuid',
      },
      level: {
        type: 'string',
        maxLength: 255,
      },
      curriculum: {
        type: 'object',
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
