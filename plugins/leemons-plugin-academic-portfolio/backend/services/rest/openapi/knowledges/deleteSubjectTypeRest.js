const { schema } = require('./schemas/response/deleteSubjectTypeRest');
const { schema: xRequest } = require('./schemas/request/deleteSubjectTypeRest');

const openapi = {
  summary: 'Deletes a specific knowledge area',
  description: `This endpoint is responsible for the deletion of a specific knowledge area from the academic portfolio system. It effectively removes the entry from the database that matches the provided knowledge area identifier.

**Authentication:** User authentication is required to access this endpoint, ensuring that only authenticated users can initiate deletion processes.

**Permissions:** The user must have administrative rights or the specific permission to alter knowledge area data. This ensures that only authorized personnel can delete knowledge areas from the system.

Upon receiving a request, the endpoint first verifies the authenticity of the user and checks if the user has the necessary permissions to proceed. It then invokes the \`removeKnowledgeArea\` core method, passing the identifier of the knowledge area to be deleted. This method interacts with the database to locate and remove the specified knowledge area. If the operation is successful, it returns a confirmation response to the user indicating that the knowledge area has been successfully deleted. Any issues during the process, such as database errors or permission denials, are handled appropriately and communicated back to the user through the response.`,
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
