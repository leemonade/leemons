// automatic hash: f36722aee8d2fbf71549bdbe3ba303db54d39b3c41e77456cfd300163f07a3c4
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    timestamps: {
      type: 'object',
      properties: {
        open: {
          type: 'number',
        },
      },
      required: ['open'],
    },
    instance: {
      type: 'string',
      minLength: 1,
    },
    student: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['timestamps', 'instance', 'student'],
};

module.exports = { schema };
