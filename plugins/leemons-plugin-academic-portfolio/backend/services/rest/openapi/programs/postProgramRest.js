const { schema } = require('./schemas/response/postProgramRest');
const { schema: xRequest } = require('./schemas/request/postProgramRest');

const openapi = {
  summary: 'Create a new academic program',
  description: `This endpoint is responsible for the creation of a new academic program within the educational institution's portfolio. It handles the reception of academic program information and registers it into the system.

**Authentication:** Users need to be authenticated to create a new academic program. The system will validate the session token before allowing access to the endpoint.

**Permissions:** Users must have the 'create_program' permission assigned to their role to execute this action. Without the proper permission, the attempt to create a program will be rejected.

Upon receiving a request, the handler initiates the 'addProgram' method from the 'programs' core service, which validates the input schema using the defined validation rules. If validation succeeds, it proceeds to insert the new program data into the database. The core logic sequences through several other services (like 'courses', 'groups', etc.), each contributing to the comprehensive creation of the program structure, including its courses, cycles, and associated learning elements. Detailed database interactions ensure the integrity and coherence of the academic program data. Once the program is successfully created, the service returns the newly created program's identifier along with a success message to the client.`,
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
