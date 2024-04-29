const { schema } = require('./schemas/response/finishMultipartRest');
const { schema: xRequest } = require('./schemas/request/finishMultipartRest');

const openapi = {
  summary: 'Completes the multipart file upload process',
  description: `This endpoint finalizes the multipart upload sequence for a file that has been uploaded in chunks. It assimilates all parts of the file that have been uploaded separately, constructs the final complete file, and makes it available for use or download.

**Authentication:** Users must be authenticated to finalize multipart uploads. A valid session or token is required to prove the user's identity and ensure that the action is securely controlled.

**Permissions:** Specific permissions are necessary for a user to complete a multipart upload. Typically, the user needs write or upload permissions on the destination where the file is being saved. This ensures that the user has the right to complete uploads to the specified directory or system.

Upon receiving a request to finalize a multipart upload, the \`finishMultipart\` method in the file service is called. This method checks for all parts of the file stored temporarily during the upload process, verifies their integrity, and concatenates them into a single file. This process may involve validation of each part's checksums to ensure no data corruption occurred during transmission. Once verified and combined, the file is then processed for any needed metadata extraction or further validation based on the file type and service configuration. On successful completion, the concatenated file is made permanently available at its destination, and appropriate metadata is updated to reflect the new file's attributes.`,
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
