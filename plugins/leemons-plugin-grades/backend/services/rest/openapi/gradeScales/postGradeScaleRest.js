const { schema } = require('./schemas/response/postGradeScaleRest');
const { schema: xRequest } = require('./schemas/request/postGradeScaleRest');

const openapi = {
  summary: 'Add a new grade scale',
  description: `This endpoint is responsible for adding a new grade scale to the system. It handles the creation of a scalable metric system that can be used for evaluating student performance within the platform. The function of this endpoint is to receive grade scale details and incorporate them into the system's existing educational framework.

**Authentication:** Users must be authenticated to submit new grade scales. The system verifies the user's credentials and session tokens to ensure legitimacy before proceeding with the request.

**Permissions:** Users need to have specific administrative rights typically reserved for educational staff or system administrators. The required permissions involve managing or altering grade scales, which is a critical aspect of the educational settings control.

Upon receiving a request, the \`postGradeScaleRest\` handler first validates the incoming data using predefined validation schemas located in the \`forms.js\`. If validation passes, it proceeds to call the \`addGradeScale\` method from the \`grade-scales\` core module. This method takes the validated data and adds a new grade scale to the database, ensuring that all necessary attributes are duly processed and stored. The operation may involve transactional controls to guarantee data integrity before finally responding to the user with the outcome of the operation, either successful addition or error details.`,
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
