const { schema } = require('./schemas/response/getDataForKeysRest');
const { schema: xRequest } = require('./schemas/request/getDataForKeysRest');

const openapi = {
  summary: 'Extract specific data items for a curriculum',
  description: `This endpoint is responsible for extracting particular data elements associated with a curriculum based on user-defined keys. The service facilitates the customization and retrieval of curriculum items to cater to different informational requirements or integrations.

**Authentication:** Authentication is required to ensure that only authorized users can access the curriculum data. Users without a valid authentication session will not be able to retrieve any data.

**Permissions:** Appropriate permissions must be granted to the user to access or modify curriculum-related data. Without sufficient permissions, the user's request to retrieve data will be denied.

Upon request, the handler commences by calling the \`getDataForKeys\` method within the curriculum core. This method accepts an array of keys that correspond to the specific items of data the user wishes to retrieve from the curriculum. Utilizing these keys, the method queries the underlying data store to fetch the relevant values. This operation may involve complex business logic, data validation, and transformations to ensure the accuracy and integrity of the data served. Once the required data points are obtained, they are formatted suitably and returned to the requester in the form of a structured JSON response, making the data readily consumable for client applications or subsequent processing steps.`,
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
