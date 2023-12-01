const { schema } = require('./schemas/response/finishMultipartRest');
const { schema: xRequest } = require('./schemas/request/finishMultipartRest');

const openapi = {
  summary: 'Complete an active multipart file upload session',
  description: `This endpoint allows for the completion of an active multipart file upload session. After all parts of a file have been successfully uploaded, this endpoint is responsible for finalizing the file assembly and making the file available for use within the application.

**Authentication:** A valid authentication session is required to use this endpoint. Users must be logged in and provide a valid token as part of the request to complete the multipart upload process.

**Permissions:** Users need to have appropriate file upload permissions granted to them to finalize multipart uploads. The permissions typically depend on the role of the user within the application and the specific use case of the file being uploaded.

Upon receiving a request to finish a multipart upload, the \`finishMultipartRest\` controller handler is called. It starts by validating the provided multipart completion token and the existence of the corresponding upload session. It then proceeds to invoke the \`finishMultipart\` method located in the \`finishMultipart\` directory, passing necessary parameters such as file metadata and part information. This method orchestrates the process of combining file parts stored in temporary storage, validating their integrity, and moving the final assembled file to a permanent storage location. Once completed, the handler calls \`dataForReturnFile\` to prepare file information for a successful response, which includes file details such as its identifier, size, and location. This file information is then returned to the client, signaling the successful completion of the file upload process.`,
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
