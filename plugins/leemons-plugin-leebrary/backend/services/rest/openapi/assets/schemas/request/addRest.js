// automatic hash: 13c432e1cdffab65579c66e98492d654e7e930e071a6949e82dbc40cc5f25f13
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    file: {
      type: 'string',
      minLength: 1,
    },
    cover: {
      type: 'string',
      minLength: 1,
    },
    categoryKey: {
      type: 'string',
      minLength: 1,
    },
    name: {
      type: 'string',
      minLength: 1,
    },
    url: {},
    program: {},
    subjects: {
      type: 'string',
      minLength: 1,
    },
    isCover: {
      type: 'boolean',
    },
  },
  required: ['file', 'cover', 'categoryKey', 'name', 'subjects', 'isCover'],
};

module.exports = { schema };
