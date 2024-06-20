const { schema } = require('./schemas/response/loadRest');
const { schema: xRequest } = require('./schemas/request/loadRest');

const openapi = {
  summary: 'Manages bulk data operations for the Leemons platform',
  description: `This endpoint handles the manipulation and management of bulk data within the Leemons platform. It allows for batch processing of data operations such as imports, exports, and updates, streamlining tasks that require handling large volumes of data simultaneously.

**Authentication:** Users need to be authenticated to perform bulk data operations. Proper authentication ensures secure access to the functionality, preventing unauthorized data manipulation.

**Permissions:** This endpoint requires specific permissions related to bulk data management. Only users granted these permissions can execute bulk data operations to maintain data integrity and security within the platform.

From the initial request, the \`loadRest\` handler orchestrates multiple stages of data processing. It begins by validating the user's authentication and permissions. Once validated, it engages various service methods designed to handle specific bulk data tasks, such as parsing large datasets or updating multiple records based on predefined criteria. These operations might utilize optimized database transactions to handle large-scale changes efficiently. The flow from request to response is meticulously structured to maintain performance and error handling, ensuring that the user receives clear feedback on the operation's outcome.`,
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
