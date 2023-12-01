const { schema } = require('./schemas/response/addPinRest');
const { schema: xRequest } = require('./schemas/request/addPinRest');

const openapi = {
  summary: "Adds a new pin asset to the user's collection",
  description: `This endpoint allows for the addition of a new pin to a user's collection of assets. It involves handling the creation of pin data associated with user assets and storing it appropriately in the system's database.

**Authentication:** User authentication is necessary for this endpoint. Only authenticated users can post a new pin asset, and attempts to do so without proper authentication will be rejected.

**Permissions:** The user must have the write permissions required to add new assets to the collection. Without the necessary permissions, the endpoint will deny the request to add a new pin asset.

Upon receiving a request, the 'addPinRest' handler invokes a specific pin-creation method defined in the underlying service logic. This method processes the incoming data and performs checks to ensure all necessary information is present and valid. Following validation, the service interacts with the database to insert the new pin record. The flow of the controller then progresses to respond with the created data object, which confirms the successful addition of the new pin asset to the user's collection. If any part of this process encounters issues, such as validation failures or database errors, an error message is sent back as a part of the response.`,
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
