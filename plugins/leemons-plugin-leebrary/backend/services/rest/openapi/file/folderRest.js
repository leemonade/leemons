const { schema } = require('./schemas/response/folderRest');
const { schema: xRequest } = require('./schemas/request/folderRest');

const openapi = {
  summary: 'Manages folder-related file operations',
  description: `This endpoint is designed to handle various file operations within a specified folder. It offers a range of functionalities such as creating, retrieving, updating, or deleting files while ensuring data integrity and proper organization within the system's file structure.

**Authentication:** Users must be authenticated to perform file operations on folders. The endpoint requires a valid session or authentication token, and failing to provide this will result in a denial of access to the respective file operations.

**Permissions:** Users must have the appropriate permissions to manipulate files within a folder. These permissions typically include rights to create, read, update, or delete files, and these rights are verified before the endpoint processes the request.

Upon receiving a request, the \`folderRest\` handler begins by assessing the action to be performed (e.g., create, retrieve, update, delete) and confirms that user authentication is valid. Depending on the operation, it may call one or more internal methods such as \`createFile\`, \`getFile\`, \`updateFile\`, or \`deleteFile\`. Each method interacts with the underlying file system or database to carry out the requested operation, ensuring that the appropriate permissions checks are made. Finally, the outcome of the operation is relayed back to the user as a JSON response, indicating the success or failure of their request with appropriate status codes and messages.`,
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
