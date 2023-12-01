// automatic hash: e0bd5be9e941a5d2b0346f71e4a18ab5b949424cb4870ae8ae5ee6d509b2a384
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    withQuestionBank: {
      type: 'string',
      minLength: 1,
    },
    id: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['withQuestionBank', 'id'],
};

module.exports = { schema };
