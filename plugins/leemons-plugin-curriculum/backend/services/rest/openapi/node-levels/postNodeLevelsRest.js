const { schema } = require('./schemas/response/postNodeLevelsRest');
const { schema: xRequest } = require('./schemas/request/postNodeLevelsRest');

const openapi = {
  summary: 'Add new node levels to the curriculum',
  description: `This endpoint allows for the addition of new node levels to a specified curriculum. It is designed to receive a structured set of node level data, validate it against predefined schemas, and subsequently integrate it into the curriculum's existing structure.

**Authentication:** User authentication is mandatory to interact with this endpoint. Access is denied for non-authenticated or improperly authenticated requests.

**Permissions:** The user must have 'curriculum_management' permission to add new node levels. Without this permission, the request will be rejected.

Upon receiving the request, the endpoint calls the \`addNodeLevels\` function from the \`nodeLevels\` core module. This function processes the incoming data, ensuring all validations are met and that the data conforms to the required format and relations for inclusion in the curriculum. It involves complex logic to correctly place the node levels within the curriculum's structure and to handle any potential conflicts with existing nodes. If the operation is successful, a confirmation response is sent back to the client indicating that the new node levels have been added. If there are any errors during the process, the client receives an error message detailing the issue.`,
  AIGenerated: 'true',
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
