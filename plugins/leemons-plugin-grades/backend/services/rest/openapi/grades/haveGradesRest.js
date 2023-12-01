const { schema } = require('./schemas/response/haveGradesRest');
const { schema: xRequest } = require('./schemas/request/haveGradesRest');

const openapi = {
  summary: 'Checks for the existence of grades related to certain criteria',
  description: `This endpoint checks whether there are grades available that match certain search criteria. The primary purpose is to confirm the presence of grades in the system without actually retrieving them.

**Authentication:** Users need to be authenticated to perform this check. Unauthorized access attempts will be rejected.

**Permissions:** The user must have the 'view grades' permission to query for the existence of grades. Users without this permission will receive an access denied error.

The flow within the controller includes calling the \`haveGrades\` method from the \`grades\` core. This method checks the database to determine if there are any grade entries that conform to the provided search parameters. The search criteria are included in the request, such as the identifiers for courses, users, or grade categories. The request context, which contains the user's authentication information, is also taken into consideration to ensure data privacy and access control. After processing, the endpoint responds with a boolean value indicating whether grades exist that match the query. No grade details are returned from this call; it serves purely as a confirmation of existence.`,
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
