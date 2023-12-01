// automatic hash: 0188bfd7555f27da9855921f5297ed2872fc875fbccb35f196f2f5ee3e1025fe
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    profiles: {
      type: 'object',
      properties: {
        teacher: {
          type: 'string',
          minLength: 1,
        },
        student: {
          type: 'string',
          minLength: 1,
        },
      },
      required: ['teacher', 'student'],
    },
  },
  required: ['status', 'profiles'],
};

module.exports = { schema };
