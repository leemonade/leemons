const { schema } = require('./schemas/response/getUserProgramsRest');
const { schema: xRequest } = require('./schemas/request/getUserProgramsRest');

const openapi = {
  summary: 'Retrieve academic programs associated with a user',
  description: `This endpoint fetches all academic programs linked to a specific user within the academic portfolio platform. It is designed to provide an overview of the user's educational engagements and progress.

**Authentication:** Users are required to be authenticated in order to access their list of academic programs. Authentication ensures that users only access programs where they have permissions or roles associated.

**Permissions:** The user must have appropriate permissions or roles related to educational oversight or student status. Typically, only administrative staff or the users themselves can view their own academic program information.

The endpoint first validates the user's authentication token to establish session legitimacy. It then proceeds to invoke the \`getUserPrograms\` method from the programs core logic. This method accesses the database to retrieve all entries under the programs table associated with the user’s ID. The method extracts program data such as program name, status, and associated courses. Finally, it returns this compiled data in a JSON format as the response to the client, ensuring the user has a comprehensive view of their academic engagements.`,
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
