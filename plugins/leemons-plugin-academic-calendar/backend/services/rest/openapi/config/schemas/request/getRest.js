// automatic hash: e2786f9f74778debc7ac46c42eed301ed905b61bb113d287d52d906dec85fdf8
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    programId: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['programId'],
};

module.exports = { schema };
