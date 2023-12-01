const { schema } = require('./schemas/response/getManyRest');
const { schema: xRequest } = require('./schemas/request/getManyRest');

const openapi = {
  // summary: "Summary",
  description: `
{
  "summary": "Retrieve multiple assignations for authenticated users",
  "description": "This endpoint is designed to fetch a list of assignations related to various items that an authenticated user has access to. These assignations typically include tasks, projects, or any kind of assignable work units that the user is associated with within the platform.

**Authentication:** Users must be logged in to retrieve their list of assignations. Unauthorized access will be prevented, and the user will receive an error if authentication credentials are not valid or not provided.

**Permissions:** The user needs to have the appropriate permissions to view assignations. This generally means that the user should have rights to interact with or be involved in the work units for which the assignations are being retrieved.

The controller handles incoming requests by utilizing a service method named \`getMany\`, which is expected to be part of the assignables service. This method would typically accept query parameters to filter the results according to the user's permissions and other criteria. The method processes the request by querying the database for relevant assignation records linked to the user’s profile. After gathering the needed information, it formats and returns the data as a JSON payload, comprising an array of assignation objects that the user is entitled to access based on their roles and permissions within the system."
}
`,
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
