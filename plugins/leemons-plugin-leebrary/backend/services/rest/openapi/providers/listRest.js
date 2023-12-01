const { schema } = require('./schemas/response/listRest');
const { schema: xRequest } = require('./schemas/request/listRest');

const openapi = {
  summary: 'Lists all resources available to the user',
  description: `This endpoint is responsible for aggregating and returning a list of all available resources that the user has access to within the library system. It compiles resources from various categories and provides a comprehensive view of the library's offerings to the user.

**Authentication:** Users must be authenticated to request the list of resources. Unauthenticated access will be prohibited, ensuring that resource listings are personalized and secure.

**Permissions:** Specific permission levels may be required to access different types of resources. The system will check the user's permission levels to determine which resources are available to them, adhering to the library's access control policies.

Upon invocation, the handler makes use of the 'listRest' action which starts by verifying the user's authentication and permission details. Once validated, it proceeds to gather resource information from multiple submodules that manage distinct categories of library items. The handler consolidates the data obtained from these submodules, applies any necessary filters based on the user's permissions, and then formats the aggregated result into a user-friendly structure. The detailed list of resources is finally returned to the caller in a JSON format, containing various metadata about the resources to aid the user in identifying and accessing the library's content.`,
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
