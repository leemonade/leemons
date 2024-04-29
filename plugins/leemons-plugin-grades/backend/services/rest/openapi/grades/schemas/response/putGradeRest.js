// automatic hash: e42d7b3469ebf4ab5e9277ca6e017963191673766633ba18080469b41097d6ab
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    grade: {
      type: 'object',
      properties: {
        _id: {
          type: 'object',
          properties: {
            valueOf: {},
          },
          required: ['valueOf'],
        },
        id: {
          type: 'string',
          minLength: 1,
        },
        deploymentID: {
          type: 'string',
          minLength: 1,
        },
        name: {
          type: 'string',
          minLength: 1,
        },
        type: {
          type: 'string',
          minLength: 1,
        },
        isPercentage: {
          type: 'boolean',
        },
        center: {
          type: 'string',
          minLength: 1,
        },
        isDeleted: {
          type: 'boolean',
        },
        deletedAt: {},
        createdAt: {
          type: 'object',
          properties: {},
          required: [],
        },
        updatedAt: {
          type: 'object',
          properties: {},
          required: [],
        },
        __v: {
          type: 'number',
        },
        minScaleToPromote: {
          type: 'string',
          minLength: 1,
        },
        scales: {
          type: 'array',
          uniqueItems: true,
          minItems: 1,
          items: {
            required: [
              'id',
              'deploymentID',
              'number',
              'description',
              'grade',
              'order',
              'isDeleted',
              '__v',
            ],
            properties: {
              _id: {
                type: 'object',
                properties: {
                  valueOf: {},
                },
                required: ['valueOf'],
              },
              id: {
                type: 'string',
                minLength: 1,
              },
              deploymentID: {
                type: 'string',
                minLength: 1,
              },
              number: {
                type: 'number',
              },
              description: {
                type: 'string',
                minLength: 1,
              },
              grade: {
                type: 'string',
                minLength: 1,
              },
              order: {
                type: 'number',
              },
              isDeleted: {
                type: 'boolean',
              },
              deletedAt: {},
              createdAt: {
                type: 'object',
                properties: {},
                required: [],
              },
              updatedAt: {
                type: 'object',
                properties: {},
                required: [],
              },
              __v: {
                type: 'number',
              },
            },
          },
        },
        tags: {
          type: 'array',
          items: {
            required: [],
            properties: {},
          },
        },
      },
      required: [
        '_id',
        'id',
        'deploymentID',
        'name',
        'type',
        'isPercentage',
        'center',
        'isDeleted',
        'createdAt',
        'updatedAt',
        '__v',
        'minScaleToPromote',
        'scales',
        'tags',
      ],
    },
  },
  required: ['status', 'grade'],
};

module.exports = { schema };
