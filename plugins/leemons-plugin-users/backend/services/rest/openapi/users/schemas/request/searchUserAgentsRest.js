// automatic hash: ab1fe1b6454e2cae2bd3a71db3af44c9d539420f5b51ca9eaca910eec240ac5a
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    filters: {
      type: 'object',
      properties: {
        queryWithContains: {
          type: 'boolean',
        },
        profile: {
          type: 'string',
          minLength: 1,
        },
        center: {
          type: 'string',
          minLength: 1,
        },
      },
      required: ['queryWithContains', 'profile', 'center'],
    },
  },
  required: ['filters'],
};

module.exports = { schema };
