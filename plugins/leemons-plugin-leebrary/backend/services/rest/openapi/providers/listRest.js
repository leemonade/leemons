const { schema } = require('./schemas/response/listRest');
const { schema: xRequest } = require('./schemas/request/listRest');

const openapi = {
  summary: 'Lists all resources in the Leebrary system',
  description: `This endpoint facilitates the retrieval of all available resources stored within the Leebrary system. It filters and presents data based on specific query parameters such as resource type, tags, and user permissions, making it an essential tool for efficient resource management.

**Authentication:** User authentication is required to access this endpoint. Users must provide a valid token that will be verified to ensure legitimacy and authority over the requested resources. Unauthorized access attempts will be logged and denied.

**Permissions:** Users need to have the 'read_resources' permission to access the list of resources. This permission checks that the user has the requisite rights to view the resources in their query scope. Lack of required permissions will result in denial of access to the resource data.

The 'listRest' handler begins by validating the user's authentication status and permissions. Following successful validation, it utilizes the \`getAllResources\` method from the \`ResourceService\`. This method takes into account various filters such as resource type and user-specific tags. It interacts directly with the database to fetch all relevant resources, ensuring all security and privacy guidelines are adhered to. The fetched data is then compiled into a tuple or list and returned in a structured JSON format as the response to the client, effectively encapsulating all accessible resources as per user credentials and query parameters.`,
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
