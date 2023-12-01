// automatic hash: 840244a3e92d9cb25bbfb37c037d4ad879da6e7f959979fc0826d31c14b270c7
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    centerId: {
      type: 'string',
      minLength: 1,
    },
    profileId: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['centerId', 'profileId'],
};

module.exports = { schema };
