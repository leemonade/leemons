const { schema } = require('./schemas/response/setManyRest');
const { schema: xRequest } = require('./schemas/request/setManyRest');

const openapi = {
  summary: 'Sets multiple user profiles in a bulk operation',
  description: `This endpoint allows for the bulk updating or creation of user profiles within the system. The operation can set multiple profiles simultaneously, handling each one according to the details provided in the request body.

**Authentication:** User authentication is required to execute this endpoint. Users attempting to access this endpoint without valid authentication will receive an error response indicating that authentication credentials are invalid or not provided.

**Permissions:** Users need to have appropriate permissions to create or update profiles. Typically, this includes administrative rights or specific profile management permissions granted by the system administrator.

Initially, the \`setManyRest\` handler in the Moleculer service calls the \`SetMany\` method from the backend’s core profile module. This method parses and validates the incoming data for each profile to be set. It checks for required fields, data integrity, and conformity to the expected format. After validation, it either updates existing profiles or creates new ones in the database, depending on whether the profiles already exist. The operation is transactional, ensuring that all profiles are set successfully or none at all, to maintain data consistency. Each profile's result is tracked, and a detailed summary of the creation or update process for each profile is compiled and returned to the user in a JSON format, indicating success or detailing any errors encountered.`,
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
