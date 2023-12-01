const { schema } = require('./schemas/response/putSubjectRest');
const { schema: xRequest } = require('./schemas/request/putSubjectRest');

const openapi = {
  summary: 'Update academic subject details',
  description: `This endpoint updates the details for an existing academic subject within the academic portfolio system, such as its name, credits, and associated program information.

**Authentication:** Users must be authenticated to update subject details. An unauthorized request will be rejected.

**Permissions:** Users need to have the 'subject.update' permission to modify a subject's details. Without the appropriate permissions, the request will fail with an authorization error.

After receiving the request, the \`putSubjectRest\` handler starts by validating the input payload against the defined schema to ensure all required fields are present and correctly formatted. It then calls the \`updateSubject\` method from the \`subjects\` core module, passing along the payload and subject ID. The \`updateSubject\` method handles the update logic, interacting with the database to apply the changes to the subject record. On success, it returns a confirmation of the update. If the update fails, due to reasons such as invalid subject ID or database constraints, an error response is sent back to the client.`,
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
