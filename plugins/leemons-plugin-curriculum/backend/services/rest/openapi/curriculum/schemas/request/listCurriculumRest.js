// automatic hash: 8acd7769f09d4c18441edd60d364e6e2ff4a7826df48bab3745b5d384cbe0fe2
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    page: {
      type: 'string',
      minLength: 1,
    },
    size: {
      type: 'string',
      minLength: 1,
    },
    canListUnpublished: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['page', 'size', 'canListUnpublished'],
};

module.exports = { schema };
