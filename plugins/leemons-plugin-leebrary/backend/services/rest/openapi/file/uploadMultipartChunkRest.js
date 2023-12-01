const { schema } = require('./schemas/response/uploadMultipartChunkRest');
const {
  schema: xRequest,
} = require('./schemas/request/uploadMultipartChunkRest');

const openapi = {
  summary: 'Uploads a file chunk as part of a multipart file upload process',
  description: `This endpoint is responsible for handling the upload of a single chunk of a larger file as part of a multipart file upload process. It is typically called multiple times for a single file, with each call handling a different portion of the file data.

**Authentication:** User authentication is required to ensure only authorized users can upload file chunks. Unauthenticated requests will be rejected.

**Permissions:** Users must have the necessary permissions to upload files to the targeted destination within the application. Without the appropriate permissions, the file upload attempt will be denied.

Upon receiving a request, \`uploadMultipartChunkRest\` action starts by validating the session to ensure the user is authenticated and checking if the user has the permission to upload files. It then processes the incoming chunk using the \`uploadMultipartChunk\` function imported from \`uploadMultipartChunk/uploadMultipartChunk.js\`. This involves buffering the stream data and appending it to the temporary file storage allocated for the file being uploaded. The endpoint implements proper error handling to manage incomplete uploads or any issues that may arise. Once a chunk is securely received and stored, the endpoint responds with the status of the operation, and if all goes well, the upload process moves on to the next chunk.`,
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
