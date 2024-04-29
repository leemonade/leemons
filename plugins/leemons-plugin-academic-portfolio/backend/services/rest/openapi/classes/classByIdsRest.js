const { schema } = require('./schemas/response/classByIdsRest');
const { schema: xRequest } = require('./schemas/request/classByIdsRest');

const openapi = {
  summary: 'Retrieve classes based on given IDs',
  description: `This endpoint retrieves detailed information about academic classes specified by their unique identifiers (IDs). The main purpose is to fetch specific class details that can facilitate educational management tasks.

**Authentication:** Users need to be logged in to access this endpoint. Authentication ensures that only authorized users can retrieve information based on their roles and permissions.

**Permissions:** This endpoint requires the user to have specific permissions such as 'view_class_details'. Access without proper permissions will lead to a denial of the request.

Upon receiving a request, the \`classByIdsRest\` handler invokes the \`classByIds\` method, located in the 'classByIds.js' core file. This method queries the database to obtain detailed information about each class whose ID was provided in the request. It processes the input ID array, performs the necessary database lookups, and handles potential errors such as missing IDs or inaccessible database entries. The result, a collection of class details, is then formatted appropriately and sent back to the user in the response body.`,
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
