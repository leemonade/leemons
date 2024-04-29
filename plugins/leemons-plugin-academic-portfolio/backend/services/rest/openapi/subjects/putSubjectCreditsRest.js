const { schema } = require('./schemas/response/putSubjectCreditsRest');
const { schema: xRequest } = require('./schemas/request/putSubjectCreditsRest');

const openapi = {
  summary: 'Updates the credit value for a specified subject',
  description: `This endpoint updates the credit value for a subject within the academic portfolio. The modification pertains to how many credits a particular subject is worth in the academic curriculum, reflecting changes directly into the academic records and related calculations for student progress and curriculum planning.

**Authentication:** Users need to be authenticated to update subject credits. The system will check for a valid session or api token before processing the request.

**Permissions:** This endpoint requires administrative permissions related to academic management. Only users with the role of 'Academic Administrator' or similar permissions can update subject credits.

Upon receiving a request, the handler first validates the incoming data against predefined schemas to ensure the subject identifier and new credit values are correctly formatted. It then calls the \`setSubjectCredits\` method from the \`subjects\` core module, which updates the credit value in the persistent storage (usually a database). This method logs the change transaction for auditing purposes. The process is designed to handle errors smoothly, returning meaningful error messages if the update cannot be completed, ensuring the client understands why the request failed. The successful update results in a confirmation message to the user, indicating the credits have been successfully updated.`,
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
