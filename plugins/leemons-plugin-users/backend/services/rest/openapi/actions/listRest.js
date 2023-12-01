const { schema } = require('./schemas/response/listRest');
const { schema: xRequest } = require('./schemas/request/listRest');

const openapi = {
  summary: 'List user-related information',
  description: `This endpoint retrieves a comprehensive list of user-related details based on the provided search criteria and pagination options. It compiles information such as user profiles, roles, activities, and permissions, offering a filtered view pertinent to admin or management use-cases within the platform.

**Authentication:** Users must be authenticated and possess an active session to interact with this endpoint. Unauthorized access attempts will be rejected.

**Permissions:** Access to this endpoint requires 'list_users' permission. Users lacking this specific permission will be unable to retrieve user information and will encounter an authorization error.

Upon invocation, the 'listRest' handler in the 'actions.rest.js' file calls upon the 'list' method in the 'actions' core. This method manages the input criteria, such as search parameters and pagination settings, and interacts with the underlying database to fetch the relevant user records. During this process, it handles the application of any filters and sort orders specified in the request. After obtaining the results, the data is formatted according to the response schema and sent back to the requester in JSON format. This entire operation must operate within the confines of the permissions set for the requesting user, ensuring that only entitled data is processed and delivered.`,
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
