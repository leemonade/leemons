// automatic hash: 7213b183d7098258de35c1ea62cd1ee28b789658ca68ce3ae7eda38356385884
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    users: {
      type: 'array',
      uniqueItems: true,
      minItems: 1,
      items: {
        required: [
          'email',
          'name',
          'surnames',
          'secondSurname',
          'gender',
          'birthdate',
        ],
        properties: {
          email: {
            type: 'string',
            minLength: 1,
          },
          name: {
            type: 'string',
            minLength: 1,
          },
          surnames: {
            type: 'string',
            minLength: 1,
          },
          secondSurname: {
            type: 'string',
            minLength: 1,
          },
          gender: {
            type: 'string',
            minLength: 1,
          },
          birthdate: {
            type: 'string',
            minLength: 1,
          },
        },
      },
    },
    center: {
      type: 'string',
      minLength: 1,
    },
    profile: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['users', 'center', 'profile'],
};

module.exports = { schema };
