const { schema } = require('./schemas/response/getUserProgramsRest');
const { schema: xRequest } = require('./schemas/request/getUserProgramsRest');

const openapi = {
  summary: 'List user-specific academic programs',
  description: `This endpoint lists all academic programs associated with the currently authenticated user. It enables users to view their academic portfolio, including programs they are enrolled in or managing.

**Authentication:** Users need to be authenticated to request their list of academic programs. The request must include a valid session token to establish the user's identity and session continuity.

**Permissions:** Users require specific permissions to access their own academic programs. The exact permissions will be determined by their roles, such as being a student, educator, or administrator within the academic platform.

Upon receiving a request, the \`getUserProgramsRest\` handler calls the \`getUserPrograms\` method defined in the core programs logic. This method queries the system's database using the current user's identity to retrieve the list of academic program IDs they are associated with. Further logic filters and compiles detailed information about each program into a structured format for the response. The response will include necessary details about the user's programs, such as program names, descriptions, enrollment status, and any other pertinent information defined within the academic portfolio schema. The compiled data is then sent back to the user as a JSON object delineating their affiliated academic programs.`,
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
