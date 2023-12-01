const { schema } = require('./schemas/response/removeRest');
const { schema: xRequest } = require('./schemas/request/removeRest');

const openapi = {
  summary: 'Remove an academic period',
  description: `This endpoint is responsible for the deletion of a specified academic period from the system. It ensures that the period identified by the provided identifier is removed along with any associated data, such as courses, grades, or evaluations related to that specific period.

**Authentication:** Users are required to be authenticated to perform a removal of an academic period. Access to this endpoint is strictly controlled to prevent unauthorized deletions.

**Permissions:** Appropriate permissions are essential for this endpoint. A user must possess the necessary rights or administrative privileges to delete academic period data.

Upon receiving a request, the endpoint invokes the \`removePeriod\` core method, which is responsible for handling the actual deletion process. This method consists of multiple steps that ensure data consistency and integrity during the deletion. It involves checking for the existence of the period, validating the user's permissions, and then proceeding with the removal of the period and any related records in the database. The response of this operation indicates the success or failure of the removal, along with any relevant messages or error information.`,
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
