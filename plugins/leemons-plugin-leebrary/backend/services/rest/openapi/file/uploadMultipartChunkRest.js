const { schema } = require('./schemas/response/uploadMultipartChunkRest');
const {
  schema: xRequest,
} = require('./schemas/request/uploadMultipartChunkRest');

const openapi = {
  summary: 'Handle chunked file uploads for large files',
  description: `This endpoint facilitates the upload of large files in multiple chunks. It is specifically designed to handle cases where a file needs to be uploaded in segments to manage the load and ensure efficient data transfer over the network.

**Authentication:** Users must be authenticated to perform file uploads. The endpoint verifies the identity of the uploader and ensures that a valid session exists before processing any uploaded content.

**Permissions:** Users need to have the 'upload_file_chunk' permission. This ensures that only authorized users can initiate and continue chunked uploads, maintaining the security and integrity of the file-handling process.

Initially, the endpoint invokes the \`uploadMultipartChunk\` method from the \`Files\` service. This method manages the reception of each file chunk, validating its part number and merging it with previous chunks if needed. It uses the \`createTemp\` function to temporarily store incoming chunks, while the \`isReadableStream\` checks if the incoming data stream is readable and not corrupted. Once all chunks have been received and verified, the \`streamToBuffer\` function compiles the chunks into a single file. An acknowledgment of successful upload or an error response detailing any issues during the process is then sent back to the client.`,
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
