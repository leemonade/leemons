// automatic hash: dddb9cc9511799955244bcc532eba79d0e26467074775721346ebee94886697c
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    ids: {
      type: 'string',
      minLength: 1,
    },
    options: {
      type: 'object',
      properties: {
        withProfile: {
          type: 'boolean',
        },
      },
      required: ['withProfile'],
    },
  },
  required: ['ids', 'options'],
};

module.exports = { schema };
