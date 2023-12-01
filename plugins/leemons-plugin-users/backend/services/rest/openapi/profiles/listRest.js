const { schema } = require('./schemas/response/listRest');
const { schema: xRequest } = require('./schemas/request/listRest');

const openapi = {
  summary: 'List user profiles',
  description: `This endpoint lists all user profiles available in the system. It compiles the profiles based on user data and related associations.

**Authentication:** Access to this endpoint requires the user to be authenticated. Failure to provide valid credentials will block access to the endpoint.

**Permissions:** The user must have the 'list_profiles' permission to retrieve the list of user profiles. Lack of appropriate permissions will result in access being denied.

The 'listRest' handler begins by invoking the \`list\` method from the \`profiles\` core, which is responsible for fetching the list of user profiles. The process involves querying the database and potentially filtering the results according to any specified criteria in the request (such as roles, groups, or other attributes). Upon successful retrieval of the profiles, the data is formatted according to the API's response requirements and returned to the client. If the database query fails, or if filtering criteria are invalid, an appropriate error is returned to the client detailing the issue.`,
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
