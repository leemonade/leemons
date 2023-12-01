const { schema } = require('./schemas/response/listDetailPageRest');
const { schema: xRequest } = require('./schemas/request/listDetailPageRest');

const openapi = {
  summary: 'Lists detailed family data accessible to the user',
  description: `This endpoint allows for the retrieval of detailed family data, specifying the structure and relationships of user-associated families within the platform. It provides a comprehensive view with nested details, often used for displaying family trees or relationship networks.

**Authentication:** User authentication is required to access family details. Unauthenticated requests will be rejected.

**Permissions:** Users need specific family-related permissions to view detailed information. Without the appropriate permissions, access to the family data will not be permitted.

The handler initiates by calling the \`listDetailPage\` method from the \`families\` core. This function is designed to aggregate complex family data, including member details and relationship contexts. The aggregation process involves querying multiple database tables, possibly utilizing joins, to formulate a detailed dataset. After the data has been compiled, it is returned and formatted appropriately, ensuring that the sensitive information is safeguarded and only relevant data is communicated back to the requester. The endpoint concludes by sending a structured JSON response containing the detailed family data for display or further client-side processing.`,
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
