const { schema } = require('./schemas/response/setInstanceTimestampRest');
const {
  schema: xRequest,
} = require('./schemas/request/setInstanceTimestampRest');

const openapi = {
  summary: 'Sets the timestamp for a specific feedback instance',
  description: `This endpoint is responsible for updating the timestamp marking when certain feedback has been reviewed or modified within the system. It essentially marks a feedback entry with the current date and time to track its processing status.

**Authentication:** Users need to be authenticated to perform this action. They must provide valid session credentials to authenticate their identity and grant them access to this endpoint.

**Permissions:** The user must have the 'manage_feedback' permission to update timestamps on feedback entities. This ensures that only authorized personnel can make changes to feedback timing, maintaining the integrity and security of the data.

The flow begins with the \`setInstanceTimestamp\` method within the \`feedback\` core module. This method accepts certain parameters, such as the instance ID of the feedback, and updates the \`timestamp\` field of the specified feedback instance in the database. This action is performed after validating that the user has the necessary permissions and is authenticated. The response to this operation is typically a confirmation of the update, including the new timestamp value.`,
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
