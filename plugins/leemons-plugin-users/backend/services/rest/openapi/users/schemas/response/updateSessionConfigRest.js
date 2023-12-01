// automatic hash: 296d79fb36d92ffd8a9abe8eb04320953dfdfbd112e2511260d2fa2338411c37
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    data: {
      type: 'array',
      uniqueItems: true,
      minItems: 1,
      items: {
        required: ['old', 'new'],
        properties: {
          old: {
            type: 'string',
            minLength: 1,
          },
          new: {
            type: 'string',
            minLength: 1,
          },
        },
      },
    },
  },
  required: ['status', 'data'],
};

module.exports = { schema };
