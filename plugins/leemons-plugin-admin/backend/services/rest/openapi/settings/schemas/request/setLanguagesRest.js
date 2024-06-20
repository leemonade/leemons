// automatic hash: 13d8034424e558e35f7785ef4d85f75cdc8174e4bd4013f5e84a607df9e4ee89
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    removeOthers: {
      type: 'boolean',
    },
    langs: {
      type: 'array',
      uniqueItems: true,
      minItems: 1,
      items: {
        required: ['code', 'name'],
        properties: {
          code: {
            type: 'string',
            minLength: 1,
          },
          name: {
            type: 'string',
            minLength: 1,
          },
        },
      },
    },
    defaultLang: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['removeOthers', 'langs', 'defaultLang'],
};

module.exports = { schema };
