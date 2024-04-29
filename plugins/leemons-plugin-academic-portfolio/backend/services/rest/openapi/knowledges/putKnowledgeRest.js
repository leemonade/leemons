const { schema } = require('./schemas/response/putKnowledgeRest');
const { schema: xRequest } = require('./schemas/request/putKnowledgeRest');

const openapi = {
  summary: 'Updates the specified knowledge area',
  description: `This endpoint updates an existing knowledge area within the academic portfolio system. It is used to modify specific details about a knowledge area, such as its title or description, ensuring that the academic portfolio remains current and accurate.

**Authentication:** User authentication is required to access this endpoint. An authenticated session must be established, and valid credentials must be provided in the request.

**Permissions:** This endpoint requires administrative permissions related to academic portfolio management. Users must have permissions to update knowledge areas to execute this operation successfully.

Upon receiving a request, the endpoint initially verifies user credentials and permissions to ensure legitimacy and authority over the requested operations. It then proceeds to call the \`updateKnowledgeArea\` method located in the 'knowledges' core module. This method handles the business logic necessary to securely update details of the knowledge area in the database. The workflow includes validation of the incoming data against predefined schemas, checking for existing knowledge area records, and applying updates where applicable. Finally, the response confirms the successful update of the knowledge area, returning details about the updated entity or an error message if the update fails.`,
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
