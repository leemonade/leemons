// automatic hash: 72574a093a3235946c38dd3360a27956011f3fc7c27048fc9bdf0533961d425d
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    fileId: {
      type: 'string',
      minLength: 1,
    },
    path: {
      type: 'string',
      minLength: 1,
    },
    etags: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
  },
  required: ['fileId', 'path', 'etags'],
};

module.exports = { schema };
