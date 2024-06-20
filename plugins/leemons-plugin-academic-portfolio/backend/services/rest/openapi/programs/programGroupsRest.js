const { schema } = require('./schemas/response/programGroupsRest');
const { schema: xRequest } = require('./schemas/request/programGroupsRest');

const openapi = {
  summary: 'Manage academic program groups information',
  description: `This endpoint allows for the administration of academic program groups within the platform, facilitating the creation, modification, and querying of program group details associated with different academic programs.

**Authentication:** Access to this endpoint requires the user to be authenticated. Users who are not authenticated will not be able to execute operations related to program groups.

**Permissions:** Users need to have specific permissions based on their roles such as administrator or academic staff to interact with program groups. This ensures that only authorized personnel can manage academic program data.

The endpoint begins by handling incoming requests in the \`programs.rest.js\` service. Depending on the request type, it then calls the appropriate method in the \`programs/index.js\` core file. For instance, if the request is to fetch program groups, the \`getProgramGroups\` method in \`getProgramGroups.js\` is activated. This method takes care of fetching all relevant program group details from the database, based on the program ID supplied through the request. The flow involves parsing the request data, validating user credentials and permissions, querying the database, and finally structuring the response that includes the program groups details formatted as a JSON object. This structured flow ensures a secure and efficient process from request to response.`,
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
