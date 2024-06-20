const { schema } = require('./schemas/response/putProgramRest');
const { schema: xRequest } = require('./schemas/request/putProgramRest');

const openapi = {
  // summary: "Summary",
  description: `{
  "summary": "Updates an academic program",
  "description": "This endpoint updates the details of an existing academic program based on the program ID provided. The updated details can include changes to the program's name, duration, associated courses, and other relevant academic parameters.

**Authentication:** Users must be logged in to update an academic program. The system checks for a valid session token before processing the request.

**Permissions:** The user needs to have 'program_update' permissions. Without the necessary permissions, the request will be rejected, and an authorization error will be returned.

After receiving the request, the endpoint first authenticates the user and checks for the necessary permissions. It then processes the incoming data, validates the provided program ID, and uses the \`updateProgram\` method from the programs core to apply the changes to the database. This method interacts with the database to update the respective entries for the academic program. Upon successfully updating the program, a confirmation message is sent back to the user in the response, along with the updated program details. If there are any issues, such as the program not existing or invalid data, the endpoint returns an appropriate error message."
}`,
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
