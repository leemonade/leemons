const { schema } = require('./schemas/response/fileRest');
const { schema: xRequest } = require('./schemas/request/fileRest');

const openapi = {
  summary: 'Manages file operations within the Leebrary plugin',
  description: `This endpoint handles various file operations such as uploading, retrieving, and managing files within the Leemons Leebrary plugin. It serves as an essential component for file management in the educational platform, enabling users to efficiently handle educational resources.

**Authentication:** Users must be authenticated to perform any file operations. Authentication ensures that operations are secure and that files are accessed only by authorized users.

**Permissions:** Users need specific permissions related to file management. These permissions determine what operations the user can perform, such as uploading new files, updating existing files, or deleting files.

The handling process starts with the specific file operation request from the user. Depending on the operation (upload, retrieve, delete, etc.), the endpoint executes the corresponding action in the backend. This includes interacting with the file system to store or fetch files, updating file metadata in the database, and ensuring that all file interactions respect user permissions and authentication status. The result of these operations is then formatted appropriately and sent back to the user as a response in JSON format.`,
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
