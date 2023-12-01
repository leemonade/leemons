const { schema } = require('./schemas/response/addRest');
const { schema: xRequest } = require('./schemas/request/addRest');

const openapi = {
  summary: 'Add a new category to the leebrary system',
  description: `This endpoint is responsible for adding a new category into the leebrary system. The category addition is a critical action that allows the categorization and organization of various resources within the leebrary.

**Authentication:** Usage of this endpoint requires the user to be authenticated. An attempt to access this endpoint without a valid authentication session will be rejected.

**Permissions:** The user must have the 'add_category' permission to use this endpoint. Without this permission, the request will be denied with an appropriate error message.

Upon receiving a request, the handler calls the \`add\` method within the \`categories\` core. This method performs several checks, including whether a category with the provided name already exists, by calling the \`exists\` method. If the category does not exist, it proceeds to insert the new category into the database using the \`add\` function. The database insertion results in the creation of a new category record, and the endpoint responds with the details of the newly created category, including its unique identifier and name.`,
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
