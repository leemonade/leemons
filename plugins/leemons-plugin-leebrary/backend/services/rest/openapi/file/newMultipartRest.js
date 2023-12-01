const { schema } = require('./schemas/response/newMultipartRest');
const { schema: xRequest } = require('./schemas/request/newMultipartRest');

const openapi = {
  summary: 'Upload and process multipart file data',
  description: `This endpoint handles the uploading of files through multipart form-data. It processes the uploaded file and stores it in the appropriate file storage system.

**Authentication:** Users must be authenticated to upload files. Without proper authentication, the user will not be able to access this endpoint.

**Permissions:** The user needs to have the appropriate permissions to upload files. Without the requisite permissions, the file upload will be denied.

Upon receiving the multipart file upload request, the \`newMultipartRest\` handler starts by validating the received file data against the service's specifications. It then delegates the process to the \`newMultipart\` controller method, which acts as an entry point to a series of functions designed to handle the file upload process. The sequence typically involves validating the file type and size, handling any specified file processing like compression or encryption, and choosing the correct file storage provider based on configuration or file metadata. Finally, the file is stored, and a record is created in the application's database for future reference. The response back to the client includes details of the uploaded file and any relevant metadata.`,
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
