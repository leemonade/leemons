const { schema } = require('./schemas/response/listGroupRest');
const { schema: xRequest } = require('./schemas/request/listGroupRest');

const openapi = {
  summary: 'Lists all academic groups',
  description: `This endpoint lists all academic groups available within the platform. It retrieves a structured list of groups, including details such as group name, members, and associated curriculum.

**Authentication:** User authentication is required to access this endpoint. Users need to provide a valid session token which will be verified before proceeding with the request.

**Permissions:** Users must have the 'view_groups' permission to list all academic groups. Lack of this permission will result in a denial of access to this endpoint.

The process starts from the \`listGroupRest\` action in the 'group.rest.js' service file, which invokes the \`listGroups\` method located in \`index.js\` within the 'groups' core module. This method queries the database to gather all existing academic groups by applying relevant filters and permissions. It ensures the integrity and security of the data by filtering out groups based on the user's credentials and permissions provided within the session. The result is then formatted and returned back to the user in a JSON structure through the REST endpoint response.`,
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
