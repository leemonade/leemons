const { schema } = require('./schemas/response/getUploadChunkUrlsRest');
const {
  schema: xRequest,
} = require('./schemas/request/getUploadChunkUrlsRest');

const openapi = {
  summary: 'Generate upload URLs for file chunks',
  description: `This endpoint generates temporary URLs for uploading file chunks. These URLs are used to securely upload parts of a large file incrementally, which helps in handling large file uploads efficiently and reliably.

**Authentication:** Users must be authenticated to generate upload chunk URLs. Access to this endpoint without valid authentication will result in a denial of service.

**Permissions:** Users need specific permissions to generate upload chunk URLs, typically linked to rights to upload files or manage file uploads within the application.

The process initiated by this endpoint involves invoking the \`getUploadChunkUrls\` method located in the \`files\` core. This method calculates the number of chunks required based on the file size submitted by the user and creates a series of secure, temporary URLs for each chunk. Each URL is specifically generated to allow a part of the file to be uploaded to a designated storage location. The completion of this operation results in a response containing a list of these URLs, which the client can use to sequentially upload chunks of the large file.`,
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
