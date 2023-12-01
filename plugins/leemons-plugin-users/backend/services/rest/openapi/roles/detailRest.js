const { schema } = require('./schemas/response/detailRest');
const { schema: xRequest } = require('./schemas/request/detailRest');

const openapi = {
  summary: 'Fetch detailed role information by unique identifier',
  description: `This endpoint is responsible for providing detailed information about a specific role within the system, identified by a unique URI. The details include the role attributes and associated permissions.

**Authentication:** Users need to be authenticated and have valid session tokens to interact with this endpoint. Unauthorized users will be denied access.

**Permissions:** Access is restricted to users who have the 'view_role_details' permission, ensuring that only authorized personnel can retrieve sensitive role information.

Upon receiving a request, the \`detailByUri\` method within the \`roles\` service is called, utilizing the unique role URI provided in the request parameters. It performs a lookup in the underlying database to fetch the complete role data. If the specified role exists, the system will assemble the details, including permissions and constraints, into a structured response. This information is then returned to the client as a JSON object, encapsulating all the necessary attributes of the role in question.`,
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
