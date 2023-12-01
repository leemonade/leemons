// automatic hash: 0ebeb644df74b6d4fa10c5e7d64c2956c3f964acdcbcca870e6092bee1fb6616
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    menuKey: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['menuKey'],
};

module.exports = { schema };
