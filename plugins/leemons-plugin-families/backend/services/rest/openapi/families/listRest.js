const { schema } = require('./schemas/response/listRest');
const { schema: xRequest } = require('./schemas/request/listRest');

const openapi = {
  summary: 'List members of families',
  description: `This endpoint lists all family members associated with the authorized user's account. The result set includes members from all the families that the user is a part of within the application.

**Authentication:** User authentication is required to ensure that the family data is only accessible to users with valid session credentials. Users attempting to access this endpoint without a valid authentication token will be denied.

**Permissions:** Users must have the 'view_family_members' permission assigned to their role. Without this permission, the user will not be able to retrieve family member data.

Upon the execution of this endpoint, the \`listRest\` handler calls the \`list\` method from the \`families\` core module. This method involves querying the database to extract all relevant family records associated with the logged-in user's ID. Subsequently, the \`list\` method aggregates the data, organizing family members under their respective families, and prepares it for a response. The controller encapsulates the operation, handling any exceptions that may occur during the process, and finally, the response is delivered to the client as a structured JSON object containing the family members' details.`,
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
