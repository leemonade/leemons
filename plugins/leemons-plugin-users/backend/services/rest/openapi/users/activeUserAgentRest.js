const { schema } = require('./schemas/response/activeUserAgentRest');
const { schema: xRequest } = require('./schemas/request/activeUserAgentRest');

const openapi = {
  // summary: "Summary",
  // description: "Description",

  'x-request': xRequest,
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema,
        },
      },
    },
  },
};

module.exports = {
  openapi,
};
