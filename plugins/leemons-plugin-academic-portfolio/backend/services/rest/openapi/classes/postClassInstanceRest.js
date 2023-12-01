const { schema } = require('./schemas/response/postClassInstanceRest');
const { schema: xRequest } = require('./schemas/request/postClassInstanceRest');

const openapi = {
  summary: 'Create new class instance in the academic portfolio',
  description: `This endpoint is responsible for creating a new class instance within the academic portfolio system. It is designed to take specific class data and register it as an instance, such as a particular offering of a course within a term, including the venue, instructor, and schedule.

**Authentication:** User authentication is mandatory for this endpoint. The operation can only be performed if the user provides valid authentication credentials.

**Permissions:** Users need to have the appropriate role or permission set that allows them to add class instances to the academic portfolio. The required permission varies according to the roles defined within the academic portfolio plugin.

Upon receipt of the class data, \`postClassInstanceRest\` handler validates the provided information against the pre-defined schema. If the data passes validation, it proceeds to call the \`addInstanceClass\` method from the corresponding backend/core class, which encapsulates the logic for inserting a new class instance into the persistent storage. The method handles any necessary checks, such as verifying that the related course and program exist, enforcing class capacity limits, and ensuring that the timing does not conflict with other scheduled classes. On successful creation, the endpoint returns details of the newly created class instance, including its unique identifier and relevant timestamps. Should an error occur during the process, appropriate HTTP status codes and error messages are generated to inform the client.`,
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
