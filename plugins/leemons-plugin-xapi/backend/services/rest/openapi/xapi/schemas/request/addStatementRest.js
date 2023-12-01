// automatic hash: 2ff0326ef9a0f463670affaa92ec1f588e1c9a0db9c387e9733c2c4f15d56cce
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
                name: {
                  type: 'string',
                  minLength: 1,
                },
                program: {
                  type: 'string',
                  minLength: 1,
                },
                type: {
                  type: 'string',
                  minLength: 1,
                },
              },
              required: ['id', 'name', 'program', 'type'],
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
