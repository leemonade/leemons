const { schema } = require('./schemas/response/createRoomRest');
const { schema: xRequest } = require('./schemas/request/createRoomRest');

const openapi = {
  summary: 'Create a new communication room',
  description: `This endpoint is responsible for creating a new communication room within the system. It allows users to set up a space where they can engage in discussions or collaborations specific to their needs.

**Authentication:** Users must be authenticated to create a new communication room. Unauthorized access will lead to rejection of the room creation request.

**Permissions:** Users need to have the 'create_room' permission granted in their role configuration. Without this permission, the attempt to create a new room will be denied.

Upon receiving a request to create a new room, the \`createRoomRest\` action initializes the creation process. It begins by utilizing the \`add\` method from the \`room\` core module, which takes the necessary room data provided in the request. This data includes information such as the room name, description, and any specific configuration or attributes needed for the room. The method proceeds to verify room details, possibly checking for duplicates or validating the structure of the data against predefined schema. If validation passes, it then interacts with the database to insert the new room record. Once the room is successfully created, it returns a confirmation including the details of the new room to the requester. The entire process ensures that only authorized and properly authenticated users can create rooms with the necessary attributes, adhering to the established permission model.`,
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
