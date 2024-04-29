// automatic hash: 3860064051e1e7ee08176f32132a90585d53b3c6f29f5a13ecc4b1c6f2a6ff12
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    surnames: {
      type: 'string',
      minLength: 1,
    },
    email: {
      type: 'string',
      minLength: 1,
    },
    birthdate: {
      type: 'string',
      minLength: 1,
    },
    locale: {
      type: 'string',
      minLength: 1,
    },
    gender: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['name', 'surnames', 'email', 'birthdate', 'locale', 'gender'],
};

module.exports = { schema };
