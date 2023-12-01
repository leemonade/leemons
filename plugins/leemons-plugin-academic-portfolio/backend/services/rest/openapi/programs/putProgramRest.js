const { schema } = require('./schemas/response/putProgramRest');
const { schema: xRequest } = require('./schemas/request/putProgramRest');

const openapi = {
  summary: "Update an academic program's details",
  description: `This endpoint updates the details of a specific academic program based on the information provided in the request payload. Any changes to the program's attributes such as its title, description, or associated courses are made persistent through this endpoint.

**Authentication:** Users must be authenticated to update program details. Only requests with a valid authentication token will be processed.

**Permissions:** Users need to have the 'edit_program' permission to make changes to an academic program's details. Without sufficient permissions, the request will be rejected.

Upon receiving a request, this handler executes the \`updateProgram\` function from the programs module which applies the new data to the specified program. It starts by validating the incoming data against predefined schemas to ensure that it adheres to the expected format. After validation, the handler checks the user's permissions to determine whether they are authorized to update the program. If the user passes the authentication and authorization checks, the handler then proceeds to call the persistence layer to update the program's details within the database. The result of the operation (whether success or error) is then formatted into a JSON response and sent back to the client.`,
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
