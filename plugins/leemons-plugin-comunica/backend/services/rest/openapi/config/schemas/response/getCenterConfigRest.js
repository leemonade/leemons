// automatic hash: 99db4ee031f305f0d3dd5aa53f6e2de7353d62b421d7d4f82d68a634a822923a
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    config: {
      type: 'object',
      properties: {
        studentsCanAddTeachersToGroups: {
          type: 'boolean',
        },
      },
      required: ['studentsCanAddTeachersToGroups'],
    },
  },
  required: ['status', 'config'],
};

module.exports = { schema };
