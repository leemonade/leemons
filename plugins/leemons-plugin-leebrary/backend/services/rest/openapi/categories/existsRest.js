const { schema } = require('./schemas/response/existsRest');
const { schema: xRequest } = require('./schemas/request/existsRest');

const openapi = {
  summary: 'Check category existence',
  description: `This endpoint checks whether a specific category exists within the leemons-plugin-leebrary system. It is typically used to validate category inputs in various operations throughout the plugin's features.

**Authentication:** The endpoint requires that users be authenticated. Failure to provide a valid authentication token will prevent access to the endpoint functionalities.

**Permissions:** Users need specific permissions related to category management to access this endpoint. The necessary permissions ensure that only authorized users can check for the existence of categories, maintaining system integrity and security.

The operation begins with the \`exists\` action within the \`categories.rest.js\` service file that calls the \`exists\` method from the \`/backend/core/categories/exists\` module. This method takes a category ID from the request parameters and checks the database for the presence of this category. The logic verifies the existence of the category using the unique identifiers provided. The final outcome of this operation is a Boolean value (true or false), which indicates whether the category is present in the database. This result is then sent back to the client as a simple JSON response indicating the existence status.`,
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
