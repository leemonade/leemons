// automatic hash: b45bc12bbb4a3645ec9e70e05b7bd82fa58d264fbee668c48fe142568db3a203
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    zone: {
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
        key: {
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
        widgetItems: {
          type: 'array',
          uniqueItems: true,
          minItems: 1,
          items: {
            required: [
              'id',
              'deploymentID',
              'zoneKey',
              'key',
              'url',
              'pluginName',
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
              zoneKey: {
                type: 'string',
                minLength: 1,
              },
              key: {
                type: 'string',
                minLength: 1,
              },
              url: {
                type: 'string',
                minLength: 1,
              },
              pluginName: {
                type: 'string',
                minLength: 1,
              },
              properties: {
                type: 'object',
                properties: {},
                required: [],
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
      },
      required: [
        '_id',
        'id',
        'deploymentID',
        'key',
        'isDeleted',
        'createdAt',
        'updatedAt',
        '__v',
        'widgetItems',
      ],
    },
  },
  required: ['status', 'zone'],
};

module.exports = { schema };
