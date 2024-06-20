// automatic hash: 91fc194c61f05903cfc6e7d0724fbcd37aaea37db8dda980f9c8b2db062cf60e
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    users: {
      type: 'array',
      uniqueItems: true,
      minItems: 1,
      items: {
        required: [
          'id',
          'deploymentID',
          'name',
          'surnames',
          'secondSurname',
          'email',
          'locale',
          'active',
          'status',
          'gender',
          'isDeleted',
          '__v',
        ],
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
          surnames: {
            type: 'string',
            minLength: 1,
          },
          secondSurname: {
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
          locale: {
            type: 'string',
            minLength: 1,
          },
          active: {
            type: 'boolean',
          },
          status: {
            type: 'string',
            minLength: 1,
          },
          gender: {
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
        },
      },
    },
  },
  required: ['status', 'users'],
};

module.exports = { schema };
