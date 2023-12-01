// automatic hash: 6652a3995b7b6d10772dd5c312843b535bec31be49f556bcd25d5812e3e662b7
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    classes: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
  },
  required: ['status', 'classes'],
};

module.exports = { schema };
