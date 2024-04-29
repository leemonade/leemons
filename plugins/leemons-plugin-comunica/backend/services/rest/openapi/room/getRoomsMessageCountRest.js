const { schema } = require('./schemas/response/getRoomsMessageCountRest');
const {
  schema: xRequest,
} = require('./schemas/request/getRoomsMessageCountRest');

const openapi = {
  summary: 'Counts messages across multiple rooms',
  description: `This endpoint is responsible for counting the number of messages in various rooms available in the system. It aggregates message data across different room entities and provides a count that reflects the total communication activity within those rooms. The function does not filter by user or room properties, focusing instead on a comprehensive count across all data points.

**Authentication:** Users must be authenticated to access this endpoint. Unauthorized access is systematically denied, ensuring that only authenticated users can retrieve message counts.

**Permissions:** This endpoint requires the user to have the 'view_messages' permission to proceed with the data retrieval. Any user without this specific permission will not be able to execute this endpoint and receive the messages count.

Upon receiving a request, the endpoint triggers the \`getRoomsMessageCount\` function from the \`room\` core module. This function queries the database to retrieve the number of messages in each room, using a method that efficiently counts messages without retrieving the full message data, optimizing both time and resource consumption. The results are then compiled into a single response object, which is returned to the requester in a structured JSON format.`,
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
