const { schema } = require('./schemas/response/listRest');
const { schema: xRequest } = require('./schemas/request/listRest');

const openapi = {
  summary: 'Lists all educational centers accessible to the user',
  description: `This endpoint lists all educational centers that the current user has access to within the leemons platform, focusing on providing a comprehensive view of centers based on user roles and permissions.

**Authentication:** Users must be authenticated to view the list of educational centers. Failure to provide valid authentication credentials will prevent access to the endpoint.

**Permissions:** Users need specific permission to view educational centers. This permission typically depends on the user's role within the system, such as administrators or educational staff having broader access rights.

Upon receiving a request, the endpoint initially verifies the user's authentication status and permissions. Once authentication and authorization are confirmed, it calls the \`listCenters\` method from the 'centers' module. This method fetches all centers from the database that the user is authorized to see, applying any relevant filters such as center type or location. The data is then formatted appropriately and returned as a JSON list, encapsulating details like center names, locations, and roles associated with each center. The flow concludes with the endpoint sending this data back to the user in a structured response.`,
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
