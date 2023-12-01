const { schema } = require('./schemas/response/loadRest');
const { schema: xRequest } = require('./schemas/request/loadRest');

const openapi = {
  summary: 'Processes bulk data import requests',
  description: `This endpoint is designed for handling bulk data import requests. It allows for large sets of data to be uploaded, processed, and inserted into the system in one operation. The endpoint expects data in a specific format and does bulk operations to efficiently manage multiple records at once.

**Authentication:** Users need to be authenticated to access this endpoint. Unauthorized access will result in an error, and the user will not be able to import data in bulk.

**Permissions:** Users require the \`bulk-data-import\` permission to initiate a bulk data import operation. Without the necessary permissions, the request will be rejected, and no import will take place.

The controller starts by validating the incoming data format and authenticates the user's session. Once validated, it invokes the \`bulkDataImport\` service. This service will typically handle parsing the data, mapping it to the required schema, and performing batch insert or update operations in the database. Any errors or exceptions that occur during the process are caught and an appropriate response is returned. If successful, the controller confirms the completion of the bulk data import process with a success message and possibly a summary of the import operation.`,
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
