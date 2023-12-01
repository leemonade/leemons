const { schema } = require('./schemas/response/haveProgramsRest');
const { schema: xRequest } = require('./schemas/request/haveProgramsRest');

const openapi = {
  summary: 'Check existence of academic programs',
  description: `This endpoint checks whether any academic programs are available in the system. It is used to determine if the setup for academic programs has been initiated or if there are programs that can potentially be enrolled in.

**Authentication:** Users need to be authenticated to verify the existence of academic programs. An authentication check ensures that only logged-in users can perform this check, safeguarding the privacy of the program-related data.

**Permissions:** The user must have the 'view_programs' permission granted to use this endpoint. Working within the permissions set by the system ensures that only authorized roles can inquire about the existence of academic programs.

After authentication and permission checks are passed, the handler for 'haveProgramsRest' calls the \`havePrograms\` function from the 'programs' core module. The \`havePrograms\` function is responsible for querying the system's database to determine if any program records exist. The end result is a boolean value indicating the presence or absence of academic programs, which is then returned to the client as part of the response body.`,
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
