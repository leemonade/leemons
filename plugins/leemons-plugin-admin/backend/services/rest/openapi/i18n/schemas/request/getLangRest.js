// automatic hash: 748dc920ee13b991eb41ca1d1032a031839eb035ac921056d4aff03dc34a4fb4
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    page: {
      type: 'string',
      minLength: 1,
    },
    lang: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['page', 'lang'],
};

module.exports = { schema };
