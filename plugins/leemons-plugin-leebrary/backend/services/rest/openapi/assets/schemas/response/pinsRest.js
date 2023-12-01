// automatic hash: 0295283c74276d72ed0c66e36c9cd6ac2adcadaf8eeca647ed12322a6470d5c9
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    assets: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
  },
  required: ['status', 'assets'],
};

module.exports = { schema };
