const { schema } = require('./schemas/response/postNodeRest');
const { schema: xRequest } = require('./schemas/request/postNodeRest');

const openapi = {
  summary: 'Add a new curriculum node',
  description: `This endpoint allows for the addition of a new node within a specified curriculum structure. A node can represent a modular unit such as a chapter, section, or a specific educational content item that fits within the broader curriculum framework.

**Authentication:** User must be logged in to create a new node. A valid authentication token is required to proceed, and failure to provide one will result in a denial of access to this endpoint.

**Permissions:** The user needs to have 'create_node' permission in their profile to perform this action. Without sufficient permissions, the system will reject the request to add a new node.

During the execution flow of this endpoint, the \`addNode\` method from the \`nodes\` core is first invoked. This method takes incoming data which typically includes the node’s title, description, the curriculum it belongs to, and any other relevant metadata. It validates the data against predefined schemas to ensure compliance with the system's requirements. Upon successful validation, the data is inserted into the curriculum structure in the database. Confirmation of this insertion is then returned to the user along with the new node's details, all sent back as a JSON object in the HTTP response.`,
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
