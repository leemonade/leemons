// automatic hash: fc68874b344e8e7ac3d78e37a2ce8106ddec342dd11c173e819c17e09d14e0f0
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    center: {
      type: 'object',
      properties: {
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
        locale: {
          type: 'string',
          minLength: 1,
        },
        uri: {
          type: 'string',
          minLength: 1,
        },
        timezone: {
          type: 'string',
          minLength: 1,
        },
        firstDayOfWeek: {
          type: 'number',
        },
        country: {
          type: 'string',
          minLength: 1,
        },
        city: {
          type: 'string',
          minLength: 1,
        },
        postalCode: {
          type: 'string',
          minLength: 1,
        },
        street: {
          type: 'string',
          minLength: 1,
        },
        _id: {
          type: 'object',
          properties: {
            valueOf: {},
          },
          required: ['valueOf'],
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
        limits: {
          type: 'array',
          uniqueItems: true,
          minItems: 1,
          items: {
            required: [
              'center',
              'deploymentID',
              'isDeleted',
              'item',
              '__v',
              'id',
              'limit',
              'type',
            ],
            properties: {
              _id: {
                type: 'object',
                properties: {
                  valueOf: {},
                },
                required: ['valueOf'],
              },
              center: {
                type: 'string',
                minLength: 1,
              },
              deploymentID: {
                type: 'string',
                minLength: 1,
              },
              isDeleted: {
                type: 'boolean',
              },
              item: {
                type: 'string',
                minLength: 1,
              },
              __v: {
                type: 'number',
              },
              createdAt: {
                type: 'object',
                properties: {},
                required: [],
              },
              deletedAt: {},
              id: {
                type: 'string',
                minLength: 1,
              },
              limit: {
                type: 'number',
              },
              type: {
                type: 'string',
                minLength: 1,
              },
              updatedAt: {
                type: 'object',
                properties: {},
                required: [],
              },
            },
          },
        },
      },
      required: [
        'id',
        'deploymentID',
        'name',
        'locale',
        'uri',
        'timezone',
        'firstDayOfWeek',
        'country',
        'city',
        'postalCode',
        'street',
        '_id',
        'isDeleted',
        'createdAt',
        'updatedAt',
        '__v',
        'limits',
      ],
    },
  },
  required: ['status', 'center'],
};

module.exports = { schema };
