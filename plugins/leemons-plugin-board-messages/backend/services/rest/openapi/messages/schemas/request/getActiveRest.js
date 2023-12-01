// automatic hash: e49fd574a79622f913a82a54a980a1eb8d0c75c2c5941f87f72cd71bb33793aa
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    center: {
      type: 'string',
      minLength: 1,
    },
    classe: {
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
  required: ['center', 'classe', 'program', 'zone'],
};

module.exports = { schema };
