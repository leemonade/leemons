const { schema } = require('./schemas/response/listRest');
const { schema: xRequest } = require('./schemas/request/listRest');

const openapi = {
  summary: 'Lists all categories available in the Leebrary system',
  description: `This endpoint retrieves a list of all categories that have been defined within the Leebrary system. The listed categories can include various types of media or content categorizations used within the platform.

**Authentication:** Users need to be authenticated to request the list of categories. An absence of valid authentication details will prevent access to this endpoint.

**Permissions:** The user must have the 'view_categories' permission to access this list. Without this permission, the request will result in an authorization error.

The request handling begins by invoking the 'listCategories' method located in the categories service. This method queries the database to fetch all existing categories, sorting and filtering them according to any provided parameters in the request. The service layer handles all interaction with the data storage to encapsulate the business logic of category retrieval. Once fetched, these categories are returned to the client in a structured JSON format, typically involving the category names and their respective identifiers.`,
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
