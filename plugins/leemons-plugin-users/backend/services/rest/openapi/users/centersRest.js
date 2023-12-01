const { schema } = require('./schemas/response/centersRest');
const { schema: xRequest } = require('./schemas/request/centersRest');

const openapi = {
  summary: "List centers linked to the current user's profile",
  description: `This endpoint lists all educational centers that are associated with the currently logged-in user's profile. It takes into account the user's roles and permissions within each center, providing a personalized view of available centers.

**Authentication:** Users must be authenticated to query their associated centers. If the user's credentials are not provided or are invalid, access to the endpoint will be denied.

**Permissions:** The user must have the 'view_centers' permission within their role to retrieve the list of centers. If the user lacks this permission, the request will be rejected.

Upon receiving a request, the handler for the 'centersRest' action invokes the \`centers\` method from the users module. This method checks the user's context for authentication and retrieves the user ID from the session token. It then proceeds to query the database for centers that the user is related to through their user profile or roles. The associated centers are filtered based on the user's permissions, ensuring that only authorized information is returned. Finally, the method collates the data into a response object, which is then sent back to the user as a JSON array containing the details of each authorized center.`,
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
