// automatic hash: 80c7853d36da7596af6fc60916defa342bc522a5922768cbeedba62dea814262
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      minLength: 1,
    },
    name: {
      type: 'string',
      minLength: 1,
    },
    minScaleToPromote: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['id', 'name', 'minScaleToPromote'],
};

module.exports = { schema };
