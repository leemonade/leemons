const { schema } = require('./schemas/response/newMultipartRest');
const { schema: xRequest } = require('./schemas/request/newMultipartRest');

const openapi = {
  summary: 'Handle multipart file upload and initialization process',
  description: `This endpoint is designed to handle the multipart file uploading and initialization process. It receives a file from the user and initiates a set of operations to securely store and register the file in the system's storage infrastructure.

**Authentication:** All users must be authenticated to upload files. A secure session or valid authentication token is required to ensure that the request originates from a legitimate source.

**Permissions:** Users need the 'upload_file' permission to perform file uploads. This ensures that only users with the appropriate rights can upload files, maintaining system integrity and security.

The process begins in the \`newMultipartRest\` action, which calls the \`newMultipart\` method in the \`Files\` core. This method orchestrates various tasks such as validating file types, preparing file storage, and interacting with different file storage providers. It delegates specific responsibilities to sub-methods like \`handleCreateFile\`, \`handleFileProvider\`, and \`handleFileSystem\`. These sub-methods manage detailed aspects of file storage, such as creating file database entries, selecting appropriate storage providers based on the configuration, and physically storing the files on disk or cloud storage. The result of this orchestrated process is a JSON object response containing details about the newly uploaded file including its access paths, metadata, and status.`,
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
