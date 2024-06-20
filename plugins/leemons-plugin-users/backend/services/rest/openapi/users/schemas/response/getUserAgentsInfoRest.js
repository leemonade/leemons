// automatic hash: f36039dadf652d5c26bd72faf37b9af61c49794578284b96aacca036ab7fac80
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    userAgents: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
  },
  required: ['status', 'userAgents'],
};

module.exports = { schema };
