const { schema } = require('./schemas/response/putSubjectRest');
const { schema: xRequest } = require('./schemas/request/putSubjectRest');

const openapi = {
  summary:
    'Updates specific details of a subject within the academic portfolio',
  description: `This endpoint allows for the modification of specific details related to a subject in the academic manager’s portfolio. It primarily facilitates updates to fields such as subject name, credit values, and internal identifiers within the context of an educational institution's system.

**Authentication:** User authentication is mandatory to access this endpoint. Requests without valid authentication will be rejected.

**Permissions:** This endpoint requires the user to have 'edit_subject' permissions within their role to update subject details. Unauthorized access attempts will lead to a denial of service.

The process begins by validating the provided JSON payload against the defined schema to ensure all required fields are present and properly formatted. It then calls the \`updateSubject\` method located in the 'subjects' core, which handles the updating of subject details in the database. This method uses both the subject ID and details from the request payload to apply updates. On successful update, a confirmation response is sent back to the client, otherwise, appropriate error messages are generated and returned based on the issue encountered during the update.`,
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
