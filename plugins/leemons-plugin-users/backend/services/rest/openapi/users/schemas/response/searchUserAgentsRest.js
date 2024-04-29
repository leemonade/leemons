// automatic hash: cb71aca793fc382832e58da4b3ff7c2b4d058bead1181ed584f2ddd60978258f
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
              'secondSurname',
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
        },
      },
    },
  },
  required: ['status', 'userAgents'],
};

module.exports = { schema };
