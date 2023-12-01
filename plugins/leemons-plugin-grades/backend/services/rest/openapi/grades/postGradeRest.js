const { schema } = require('./schemas/response/postGradeRest');
const { schema: xRequest } = require('./schemas/request/postGradeRest');

const openapi = {
  summary: 'Post a new grade record',
  description: `This endpoint is responsible for creating a new grade record within the system. It accepts the necessary information for the grade and stores it in the database. It ensures that the data adheres to the defined grade schema and applies any additional business logic required for grade creation.

**Authentication:** Users need to be authenticated to post a new grade record. The endpoint requires a valid authentication token to process the request.

**Permissions:** Users must have the 'create_grade' permission to add new grade records. Without this permission, the request will be rejected.

Upon receiving a request, the controller first validates the incoming data against the grade schema defined in the backend. It then proceeds to call the \`addGrade\` method, which encapsulates the logic for inserting the new grade record into the database. After successful creation, the response includes the details of the new grade entry. If the process encounters any errors, these are handled appropriately and the client is informed of any issues encountered during grade record creation.`,
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
