// automatic hash: 8b862df092cc0fdeb09c7494381480f92e771167efd7d4bab9cdfb71491a7ee7
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    credentials: {
      type: 'object',
      properties: {
        sessionExpiration: {
          type: 'object',
          properties: {},
          required: [],
        },
        connectionConfig: {
          type: 'object',
          properties: {
            host: {
              type: 'string',
              minLength: 1,
            },
            region: {
              type: 'string',
              minLength: 1,
            },
            protocol: {
              type: 'string',
              minLength: 1,
            },
            accessKeyId: {
              type: 'string',
              minLength: 1,
            },
            secretKey: {
              type: 'string',
              minLength: 1,
            },
            sessionToken: {
              type: 'string',
              minLength: 1,
            },
          },
          required: [
            'host',
            'region',
            'protocol',
            'accessKeyId',
            'secretKey',
            'sessionToken',
          ],
        },
        topics: {
          type: 'array',
          items: {
            required: [],
            properties: {},
          },
        },
      },
      required: ['sessionExpiration', 'connectionConfig', 'topics'],
    },
  },
  required: ['status', 'credentials'],
};

module.exports = { schema };
