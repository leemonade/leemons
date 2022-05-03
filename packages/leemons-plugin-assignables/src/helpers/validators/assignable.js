const _ = require('lodash');
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
      oneOf: [
        {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              maxLength: 255,
            },
            tagline: {
              type: 'string',
              maxLength: 255,
            },
            description: {
              type: 'string',
              maxLength: 16777215,
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
                maxLength: 255,
              },
            },
            color: {
              type: 'string',
            },
            cover: {
              type: 'string',
            },
          },
        },
        {
          type: 'string',
        },
      ],
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
      nullable: true,
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
  const obj = _.clone(assignableValidationObject);
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
