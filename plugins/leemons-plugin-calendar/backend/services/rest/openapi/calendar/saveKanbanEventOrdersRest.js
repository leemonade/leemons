const { schema } = require('./schemas/response/saveKanbanEventOrdersRest');
const {
  schema: xRequest,
} = require('./schemas/request/saveKanbanEventOrdersRest');

const openapi = {
  summary: 'Save the order of Kanban events',
  description: `This endpoint allows the user to update the order of Kanban events for a specific Kanban board. The updated order is expected to reflect changes made by the user in the frontend, ensuring that the visual arrangement of events matches the backend data.

**Authentication:** Users need to be authenticated to perform this action. An attempt to access this endpoint without proper authentication will be rejected.

**Permissions:** The user must have the necessary permissions to modify the Kanban board event orders. If the user lacks these permissions, the request will be denied with an appropriate error message.

Upon receiving a request, the controller invokes the \`saveKanbanEventOrders\` method. This method is responsible for processing the request payload that contains the new order for Kanban events. It validates the input data, and assuming the user has the required permissions, it updates the event order in the persistent storage. The operation is transactional, ensuring that the changes are committed only if they are valid and complete. Upon successful update, a confirmation is sent back to the user, along with any relevant metadata concerning the update. In case of failure, an error message detailing the issue is returned.`,
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
