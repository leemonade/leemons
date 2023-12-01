const { schema } = require('./schemas/response/existsRest');
const { schema: xRequest } = require('./schemas/request/existsRest');

const openapi = {
  summary: 'Check if a category exists',
  description: `This endpoint checks for the existence of a specific category in the system. The check is performed by comparing the provided category identifier against the database entries for categories.

**Authentication:** Users need to be authenticated to use this endpoint as it may contain sensitive category information or may be part of privileged operations within the library system.

**Permissions:** Users should have the 'category_view' permission or equivalent to invoke this endpoint as it involves accessing category data which may be restricted.

Upon receiving a request, the 'existsRest' handler begins by extracting the category identifier from the request parameters. It then calls the 'exists' function from the 'categories/exists' module, passing the identifier as an argument. The 'exists' function uses this identifier to query the database and determine whether a category with such an identifier is present or not. The result of this operation is a boolean value that is returned as the HTTP response, indicating the existence (true) or non-existence (false) of the specified category.`,
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
