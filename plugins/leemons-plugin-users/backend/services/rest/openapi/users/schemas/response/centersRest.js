// automatic hash: 20b9a2620ba2b7444bbe86456b8d67aeb1c14bc82bc8c1fd1ec68d0397cc6570
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    centers: {
      type: 'array',
      uniqueItems: true,
      minItems: 1,
      items: {
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
          profiles: {
            type: 'array',
            uniqueItems: true,
            minItems: 1,
            items: {
              required: [
                'id',
                'deploymentID',
                'name',
                'description',
                'uri',
                'indexable',
                'sysName',
                'isDeleted',
                '__v',
                'role',
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
                name: {
                  type: 'string',
                  minLength: 1,
                },
                description: {
                  type: 'string',
                  minLength: 1,
                },
                uri: {
                  type: 'string',
                  minLength: 1,
                },
                indexable: {
                  type: 'boolean',
                },
                sysName: {
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
                role: {
                  type: 'string',
                  minLength: 1,
                },
              },
            },
          },
        },
      },
    },
  },
  required: ['status', 'centers'],
};

module.exports = { schema };
