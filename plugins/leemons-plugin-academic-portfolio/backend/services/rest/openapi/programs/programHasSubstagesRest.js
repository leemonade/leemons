const { schema } = require('./schemas/response/programHasSubstagesRest');
const {
  schema: xRequest,
} = require('./schemas/request/programHasSubstagesRest');

const openapi = {
  summary: 'Determines if a specific academic program contains substages',
  description: `This endpoint checks whether a given academic program has any associated substages within the system. The check provides insights into the program structure and can inform various academic processes.

**Authentication:** User authentication is required to access the endpoint. Users must provide valid credentials to perform this operation.

**Permissions:** Appropriate permissions are needed to query the program's substages information. Users without sufficient permissions will be barred from accessing this data.

Upon handling the request, the endpoint calls the \`getProgramSubstages\` method from the \`programs\` core, utilizing the program identifier provided in the request parameters. The method queries the database to identify all associated substages of the specified program. The flow of this process involves accessing program data, checking for the existence of substages, and finally, responding with a confirmation status indicating whether or not substages are present for the queried program. The response is conveyed using a boolean value in a JSON structure.`,
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
