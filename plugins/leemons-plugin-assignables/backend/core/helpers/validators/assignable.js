const _ = require('lodash');

const { LeemonsValidator } = require('@leemons/validator');

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
              nullable: true,
            },
            description: {
              type: 'string',
              maxLength: 16777215,
              nullable: true,
            },
            tags: {
              type: 'array',
              nullable: true,
              items: {
                type: 'string',
                maxLength: 255,
              },
            },
            color: {
              type: 'string',
              nullable: true,
            },
            cover: {
              type: ['object', 'string'],
              nullable: true,
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
    center: {
      type: 'string',
      nullable: true,
    },
    subjects: subjectsValidationObject,
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
    duration: {
      type: 'string',
      maxLength: 255,
      nullable: true,
    },
    resources: {
      type: 'array',
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

const validAssignableProperties = [
  'asset.name',
  'asset.tagline',
  'asset.description',
  'asset.tags',
  'asset.color',
  'asset.cover',
  'role',
  'gradable',
  'center',
  'subjects',
  // 'methodology',
  'statement',
  'development',
  // 'relatedAssignables',
  'duration',
  'resources',
  'submission',
  'instructionsForTeachers',
  'instructionsForStudents',
  'metadata',
];

const assignableRequiredProperties = ['asset', 'role'];

function validateAssignable(assignable, { validationObject, useRequired = false } = {}) {
  const obj = validationObject || _.clone(assignableValidationObject);
  if (useRequired) {
    if (Array.isArray(useRequired)) {
      obj.required = useRequired;
    } else {
      obj.required = assignableRequiredProperties;
    }
  }

  const validator = new LeemonsValidator(obj, { allowUnionTypes: true });

  if (!validator.validate(assignable)) {
    throw validator.error;
  }
}

module.exports = {
  assignableValidationObject,
  assignableRequiredProperties,
  validateAssignable,
  validAssignableProperties,
};
