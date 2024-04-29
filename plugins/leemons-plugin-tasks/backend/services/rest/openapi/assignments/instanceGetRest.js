const { schema } = require('./schemas/response/instanceGetRest');
const { schema: xRequest } = require('./schemas/request/instanceGetRest');

const openapi = {
  summary: 'Fetches specific task assignment details',
  description: `This endpoint fetches details for a specific task assignment based on the provided assignment identifier. It retrieves comprehensive information including the task description, status, assigned users, and any associated deadlines or milestones.

**Authentication:** Users must be authenticated to request the details of an assignment. Failure to provide a valid authentication token will result in denial of access to this endpoint.

**Permissions:** Users need to have 'read' permission on the task assignments module to access this endpoint. Without the requisite permissions, the request will be denied, ensuring that only authorized personnel can view sensitive assignment details.

Upon receiving the request, the endpoint initially verifies the authentication and permission levels of the user from the context provided. If authentication or permission checks fail, an error response is generated. If checks pass, the \`getAssignmentById\` method from the \`Assignments\` service is called with the assignment identifier to fetch the relevant details. This method interacts with the database to retrieve the full information pertaining to the requested assignment, which is then formatted and returned as a JSON object in the response. The entire processing ensures data integrity and security compliance by adhering to the defined access controls.`,
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
