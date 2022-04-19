const { subjectsValidationObject } = require('./subjects');

// AJV Validator
const assignableValidationObject = {
  type: 'object',
  properties: {
    /*
      name
      tagline
      summary
      tags
      color
      cover
    */
    asset: {
      type: 'string',
      minLength: 36,
      maxLength: 255,
    },
    role: {
      type: 'string',
      maxLength: 255,
      minLength: 1,
    },
    gradable: {
      type: 'boolean',
    },
    program: {
      type: 'string',
      format: 'uuid',
      nullable: true,
    },
    subjects: subjectsValidationObject,
    methodology: {
      type: 'string',
      maxLength: 255,
      nullable: true,
    },
    statement: {
      type: 'string',
      maxLength: 16777215,
      nullable: true,
    },
    development: {
      type: 'string',
      maxLength: 16777215,
      nullable: true,
    },
    relatedAssignables: {
      type: 'object',
      properties: {
        before: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
        after: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
      },
    },
    duration: {
      type: 'string',
      maxLength: 255,
      nullable: true,
    },
    submission: {
      type: 'object',
      nullable: true,
    },
    instructionsForTeachers: {
      type: 'string',
      maxLength: 16777215,
      nullable: true,
    },
    instructionsForStudents: {
      type: 'string',
      maxLength: 16777215,
      nullable: true,
    },
    metadata: {
      type: 'object',
      nullable: true,
    },
  },
  additionalProperties: false,
};

const assignableRequiredProperties = [
  'asset',
  'role',
  'assessable',
  'methodology',
  'statement',
  'development',
];

function validateAssignable(assignable, { useRequired = false } = {}) {
  const obj = assignableValidationObject;
  if (useRequired) {
    obj.required = assignableRequiredProperties;
  }

  const validator = new global.utils.LeemonsValidator(obj);

  if (!validator.validate(assignable)) {
    throw validator.error;
  }
}

module.exports = {
  assignableValidationObject,
  assignableRequiredProperties,
  validateAssignable,
};
