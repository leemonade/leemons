const { schema } = require('./schemas/response/setInstanceTimestampRest');
const {
  schema: xRequest,
} = require('./schemas/request/setInstanceTimestampRest');

const openapi = {
  summary: 'Sets the current timestamp on a feedback instance',
  description: `This endpoint allows setting the current timestamp on a given feedback instance identified by its unique ID. The purpose is to update the instance's metadata with the latest time, indicating when the last interaction or modification occurred.

**Authentication:** Users must be authenticated to set timestamps on feedback instances. Unauthorized attempts will be rejected.

**Permissions:** This action requires the user to have specific permissions that authorize them to update feedback instance timestamps. Lack of proper permissions will result in a denial of the request.

The handler implements a process where it first validates the presence of the required feedback instance ID in the request. Upon successful validation, it invokes the \`setInstanceTimestamp\` function from the feedback core logic. This function acts to record the current time as a timestamp within the feedback instance's relevant record in the database. Finally, the endpoint responds with a confirmation of the update or an appropriate error message if the operation failed.`,
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
