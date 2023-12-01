// automatic hash: 7531c866934418a6ad2f640a2385a24d4bdef12da1b60ee544f080304aa86cc3
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    filters: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            center: {
              type: 'string',
              minLength: 1,
            },
          },
          required: ['center'],
        },
      },
      required: ['user'],
    },
    options: {
      type: 'object',
      properties: {
        withCenter: {
          type: 'boolean',
        },
        withProfile: {
          type: 'boolean',
        },
        onlyContacts: {
          type: 'boolean',
        },
      },
      required: ['withCenter', 'withProfile', 'onlyContacts'],
    },
  },
  required: ['filters', 'options'],
};

module.exports = { schema };
