const { schema } = require('./schemas/response/addRest');
const { schema: xRequest } = require('./schemas/request/addRest');

const openapi = {
  summary: 'Add a new family record to the system',
  description: `This endpoint is responsible for adding a new family record into the database. It typically involves receiving data pertaining to the family which may include unique identifiers, names, and related information used to create a new entry in the families table.

**Authentication:** Users need to be authenticated to create a new family. The endpoint requires a valid user session token to proceed with the request.

**Permissions:** Users need to have administrative rights or specific role-based permissions enabled to add a new family. These permissions ensure that only authorized personnel can make modifications to the family records.

Upon receiving a request, the endpoint initially validates the provided data against predefined schemas to ensure compliance with the database structure. Following successful validation, the \`add\` method within the Families core service is called. This method involves constructing a database query to insert the new family data into the families table. After the database operation, the endpoint responds with the newly created family record or an appropriate error message if the operation fails.`,
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
