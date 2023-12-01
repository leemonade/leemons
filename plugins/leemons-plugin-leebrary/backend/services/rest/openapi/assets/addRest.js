const { schema } = require('./schemas/response/addRest');
const { schema: xRequest } = require('./schemas/request/addRest');

const openapi = {
  summary: "Add a new asset to the user's library",
  description: `This endpoint allows for the creation of a new asset within the user's library. The asset can include various types of files and metadata. Once added, the asset is stored and managed by the library service, accessible for the user and shared with others according to the specified permissions.

**Authentication:** User authentication is required to add a new asset. The endpoint expects a valid session or authentication token, without which the request will be rejected.

**Permissions:** The user needs to have 'create' permission on the library resource to add a new asset. If the user does not have the necessary permission, the endpoint will deny the request.

Upon receiving the request, the handler first validates the supplied information, ensuring that all required fields are present and correctly formatted. It then processes any files associated with the asset, such as uploading and storing them in the relevant file system. The metadata is also normalized and stored in the database. The handler then checks the user's permissions to confirm that they can add the asset. If everything checks out, the new asset is created, and an acknowledgment is returned to the user. The entire operation is wrapped in a transaction to ensure data consistency and to roll back changes if any step fails.`,
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
