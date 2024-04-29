const { schema } = require('./schemas/response/getScormAssignationRest');
const {
  schema: xRequest,
} = require('./schemas/request/getScormAssignationRest');

const openapi = {
  summary: 'Fetch SCORM assignation details for a user',
  description: `This endpoint retrieves the SCORM assignation details assigned to a particular user within the leemons platform. Based on the user's unique identification, it finds the relevant SCORM content that has been allocated to them, generally for educational or training purposes.

**Authentication:** Users need to be authenticated to access this endpoint. Unauthenticated requests are denied, ensuring that access is securely managed.

**Permissions:** Users must have the 'view_scorm_assignations' permission to view SCORM assignation details. Without this permission, the API will restrict access to the requested resources.

Upon receiving a request, this endpoint calls the \`getScormAssignation\` method in the backend core process. This method retrieves the SCORM assignment data linked to the user's ID supplied in the request context (\`ctx\`). It efficiently processes the information to ensure that the data concerning SCORM allocations is accurate, handling any exceptions or errors during the data retrieval. Finally, the results are formatted appropriately and sent back to the user, providing clear details of the SCORM assignation in question.`,
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
