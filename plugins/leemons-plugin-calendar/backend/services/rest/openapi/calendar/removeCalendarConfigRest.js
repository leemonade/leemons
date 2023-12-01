const { schema } = require('./schemas/response/removeCalendarConfigRest');
const {
  schema: xRequest,
} = require('./schemas/request/removeCalendarConfigRest');

const openapi = {
  summary: 'Removes a specified calendar configuration',
  description: `This endpoint is responsible for deleting a calendar configuration based on the provided configuration ID. The associated events and other related configurations are also removed as part of the cleanup process.

**Authentication:** Users must be logged in to perform this operation. Actions taken by unauthenticated users will be rejected, and they will receive an appropriate error message.

**Permissions:** Users need to have the 'calendar.config.delete' permission to delete a calendar configuration. Without this permission, the request will be denied, and an error message will be returned to the user.

Upon receiving a request to delete a calendar configuration, the \`removeCalendarConfigRest\` handler initiates the deletion process by calling the \`remove\` method from the \`calendar-configs\` core. This method ensures that all linked data such as center calendar configurations and calendar events associated with the configuration ID are properly removed. The \`remove\` method performs the necessary database operations to delete the configuration and its dependencies. Once the operation is complete, a success response is sent back to the client, indicating that the calendar configuration has been successfully removed. If any issues arise during the process, an error response is generated detailing the problem encountered.`,
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
