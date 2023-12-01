const { schema } = require('./schemas/response/assetTypesRest');
const { schema: xRequest } = require('./schemas/request/assetTypesRest');

const openapi = {
  summary: 'Manages asset types for library resources',
  description: `This endpoint is responsible for managing the various asset types associated with library resources. It provides functionalities such as retrieving, adding, updating, and deleting the asset types that are utilized to categorize digital assets within the platform's library system.

**Authentication:** Users need to be authenticated to interact with this endpoint. Unauthorized access attempts will be rejected, ensuring that only valid sessions can perform operations related to asset types.

**Permissions:** Users must possess the appropriate permissions to manage asset types. Lack of the necessary permissions to perform such administrative tasks will result in an access denial.

Upon receiving a request, this endpoint initially verifies user authentication and permission levels. If the necessary criteria are satisfied, it proceeds to call the relevant method from the \`AssetTypesService\`, which encapsulates the business logic for dealing with asset types. The methods within the service interact with the underlying database to fetch, manipulate or persist asset type data accordingly. Based on the operation requested and the ensuing function, the result is formatted and then sent back in the response payload as JSON, reflecting the changes made to the asset types or reporting the outcome of the request.`,
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
