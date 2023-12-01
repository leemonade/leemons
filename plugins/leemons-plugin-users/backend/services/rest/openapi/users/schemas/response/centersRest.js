// automatic hash: 159c1a4cf17346f6ef2517c2191b1a77350fbc107be793ae6f5756ac007c21af
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
          'description',
          'locale',
          'email',
          'uri',
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
          description: {
            type: 'string',
            minLength: 1,
          },
          locale: {
            type: 'string',
            minLength: 1,
          },
          email: {
            type: 'string',
            minLength: 1,
          },
          uri: {
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
