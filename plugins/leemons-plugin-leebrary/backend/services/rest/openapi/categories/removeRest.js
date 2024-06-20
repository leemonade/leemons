const { schema } = require('./schemas/response/removeRest');
const { schema: xRequest } = require('./schemas/request/removeRest');

const openapi = {
  summary: 'Remove a specified category',
  description: `This endpoint handles the removal of a category from the system. Once triggered, it ensures that the specified category and any related data are deleted permanently from the database.

**Authentication:** User must be logged in to perform this operation. Authentication ensures that the action is performed by a verified user.

**Permissions:** This endpoint requires administrator-level permissions. The user must have the right to modify or delete categories within the system.

The \`removeRest\` action starts by validating the provided category ID against the database to ensure it exists. Upon successful validation, it invokes the \`remove\` method from the \`categories/remove\` core, which facilitates the actual deletion process. This method handles all relational deletions and integrity checks to avoid any orphan records. Detailed logs are generated through this process to monitor the steps taken and any potential errors. The final response will confirm the successful removal of the category or report any errors encountered during the process.`,
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
