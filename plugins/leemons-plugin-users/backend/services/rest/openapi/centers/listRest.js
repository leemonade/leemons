const { schema } = require('./schemas/response/listRest');
const { schema: xRequest } = require('./schemas/request/listRest');

const openapi = {
  summary: 'List all centers accessible by the current user',
  description: `This endpoint lists all educational centers that are accessible to the currently authenticated user. The list includes centers that the user is affiliated with, either through direct association or through permissions granted within the multi-tenant educational platform.

**Authentication:** Users must be authenticated to obtain the list of accessible centers. Requests without valid authentication will be rejected.

**Permissions:** Users need to have appropriate permissions to view the list of educational centers. These permissions are typically tied to the user's role and the level of access granted to them within the organization's hierarchy.

On receiving a request, the handler calls upon the \`listCenters\` method located in the 'centers' core. The method examines the current context (\`ctx\`) which includes user authentication and permission information. It consults a data store to retrieve the list of centers based on the user's access rights. It assembles the collection of centers, ensuring that only information the user is permitted to see is included. The handler then returns the prepared list in the response body as a JSON-formatted array.`,
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
