// automatic hash: 0228ffd6121ba5b45ba9b53f06701dce445752ec17146cb6dd9c5c5b2928e335
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    students: {
      type: 'string',
      minLength: 1,
    },
    classes: {
      type: 'string',
      minLength: 1,
    },
    periods: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['students', 'classes', 'periods'],
};

module.exports = { schema };
