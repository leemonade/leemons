const { schema } = require('./schemas/response/putGradeTagRest');
const { schema: xRequest } = require('./schemas/request/putGradeTagRest');

const openapi = {
  summary: 'Update grade tag details',
  description: `This endpoint updates the information for an existing grade tag based on the given identifier. It modifies existing data such as the tag name, associated color, and potentially other metadata specific to the grade system.

**Authentication:** Users need to be authenticated to perform an update on grade tags. Without valid authentication credentials, the request will be rejected.

**Permissions:** This function requires administrative privileges or specific permissions related to grade management. Users without adequate permissions will receive an access denied response.

The function flow begins with the extraction of the grade tag ID and updates data from the request body. It then calls the \`updateGradeTag\` method from the \`grade-tags\` service with the extracted data. This method is responsible for validating the data against existing schemas and applying the updates to the database. Upon successful update, a confirmation is sent back to the client detailing the updated fields. In case of any errors during the update process, appropriate error messages are returned to the client, highlighting the issues encountered.`,
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
