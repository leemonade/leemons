const { schema } = require('./schemas/response/updateRest');
const { schema: xRequest } = require('./schemas/request/updateRest');

const openapi = {
  summary: 'Update instance details',
  description: `This endpoint updates specific details of an instance based on the provided identifier. It is typically used to modify parameters like name, status, or configuration settings of an instance within the system.

**Authentication:** User authentication is mandatory to ensure that the request is made by a system-recognized user. Access without valid authentication will result in refusal of the operation.

**Permissions:** This action requires the user to have 'edit' permission on the instance entity. Without the necessary permissions, the operation will not be processed, and an error will be returned.

Upon receiving the request, the \`updateInstance\` method is activated within the controller, which first checks for the presence of a valid user session and appropriate permissions. Following these checks, it retrieves the instance data from the database, updates the fields as per the request, and then commits these changes to the database. The process involves validation of the input data against pre-set criteria to prevent invalid data storage. On success, the updated instance data is sent back to the client, encapsulating the changes in a JSON format.`,
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
