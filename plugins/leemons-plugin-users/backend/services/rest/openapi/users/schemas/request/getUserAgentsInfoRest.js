// automatic hash: 99665fbb517db39b3b8e643687f557df3afc9d90689d194ee0de1d27eca1f656
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    ids: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
    options: {
      type: 'object',
      properties: {
        withCenter: {
          type: 'boolean',
        },
        withProfile: {
          type: 'boolean',
        },
      },
      required: ['withCenter', 'withProfile'],
    },
  },
  required: ['ids', 'options'],
};

module.exports = { schema };
