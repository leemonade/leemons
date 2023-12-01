// automatic hash: f12c510744eaf5b7931ccef45ecf837f16a562861328435c1914e7d191c39c83
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    userAgents: {
      type: 'array',
      uniqueItems: true,
      minItems: 1,
      items: {
        required: ['id', 'role', 'disabled'],
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
          user: {
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
              name: {
                type: 'string',
                minLength: 1,
              },
              surnames: {
                type: 'string',
                minLength: 1,
              },
              email: {
                type: 'string',
                minLength: 1,
              },
              birthdate: {
                type: 'object',
                properties: {},
                required: [],
              },
              gender: {
                type: 'string',
                minLength: 1,
              },
              createdAt: {
                type: 'object',
                properties: {},
                required: [],
              },
              avatar: {
                type: 'string',
                minLength: 1,
              },
            },
            required: [
              '_id',
              'id',
              'name',
              'surnames',
              'email',
              'birthdate',
              'gender',
              'createdAt',
              'avatar',
            ],
          },
          role: {
            type: 'string',
            minLength: 1,
          },
          disabled: {
            type: 'boolean',
          },
          profile: {
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
            required: [
              '_id',
              'id',
              'deploymentID',
              'name',
              'description',
              'uri',
              'indexable',
              'sysName',
              'isDeleted',
              'createdAt',
              'updatedAt',
              '__v',
              'role',
            ],
          },
          center: {
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
            },
            required: [
              '_id',
              'id',
              'deploymentID',
              'name',
              'description',
              'locale',
              'email',
              'uri',
              'isDeleted',
              'createdAt',
              'updatedAt',
              '__v',
            ],
          },
        },
      },
    },
  },
  required: ['status', 'userAgents'],
};

module.exports = { schema };
