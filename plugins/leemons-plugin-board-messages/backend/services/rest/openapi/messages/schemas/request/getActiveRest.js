// automatic hash: 7c6ed05a06be076802eaad1186d5116bb7686edd8805c8da5098fe74cbe5b95c
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    center: {
      type: 'string',
      minLength: 1,
    },
    program: {
      type: 'string',
      minLength: 1,
    },
    zone: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['center', 'program', 'zone'],
};

module.exports = { schema };
