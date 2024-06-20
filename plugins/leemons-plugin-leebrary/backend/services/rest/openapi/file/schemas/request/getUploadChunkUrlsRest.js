// automatic hash: fd6f53523a20c9d52ecbd9901d56b7b8513fe9ab28e217cbf818e60d94617284
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    fileId: {
      type: 'string',
      minLength: 1,
    },
    nChunks: {
      type: 'number',
    },
    path: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['fileId', 'nChunks', 'path'],
};

module.exports = { schema };
