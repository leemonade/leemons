// automatic hash: 0ae522a04f2aafc8dda045f3d7414bf99fd3ea1db4bc66db8a12fe6db0c9ebba
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    course: {},
    internalId: {
      type: 'string',
      minLength: 1,
    },
    program: {
      type: 'string',
      minLength: 1,
    },
    credits: {
      type: 'number',
    },
    color: {
      type: 'string',
      minLength: 1,
    },
    image: {
      type: 'string',
      minLength: 1,
    },
    icon: {
      type: 'string',
      minLength: 1,
    },
  },
  required: [
    'name',
    'internalId',
    'program',
    'credits',
    'color',
    'image',
    'icon',
  ],
};

module.exports = { schema };
