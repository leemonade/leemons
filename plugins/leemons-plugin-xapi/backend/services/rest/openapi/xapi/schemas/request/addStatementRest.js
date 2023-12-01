// automatic hash: 4c7c76dd27ca29c906f57ea53c7e5dcfee8ef33b49c668cf70b16b01e0b93a84
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    verb: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          minLength: 1,
        },
        display: {
          type: 'object',
          properties: {
            'en-US': {
              type: 'string',
              minLength: 1,
            },
          },
          required: ['en-US'],
        },
      },
      required: ['id', 'display'],
    },
    object: {
      type: 'object',
      properties: {
        objectType: {
          type: 'string',
          minLength: 1,
        },
        id: {
          type: 'string',
          minLength: 1,
        },
        definition: {
          type: 'object',
          properties: {
            extensions: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  minLength: 1,
                },
                ip: {
                  type: 'string',
                  minLength: 1,
                },
              },
              required: ['id', 'ip'],
            },
            description: {
              type: 'object',
              properties: {
                'en-US': {
                  type: 'string',
                  minLength: 1,
                },
              },
              required: ['en-US'],
            },
          },
          required: ['extensions', 'description'],
        },
      },
      required: ['objectType', 'id', 'definition'],
    },
    type: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['verb', 'object', 'type'],
};

module.exports = { schema };
