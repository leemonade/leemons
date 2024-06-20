const {
  schema,
} = require('./schemas/response/listMultipleSubjectsClassesRest');
const {
  schema: xRequest,
} = require('./schemas/request/listMultipleSubjectsClassesRest');

const openapi = {
  summary: 'List multiple subject classes based on specified criteria',
  description: `This endpoint provides a detailed list of subject classes based on the specified criteria. It is designed to help users efficiently retrieve information about different classes within various subjects as a consolidated response. This can include classes across different departments or faculties, filtered according to the input parameters, which are encapsulated within the request.

**Authentication:** Users need to be authenticated to request this information. Access to the endpoint requires the user to provide valid authentication credentials, which will be verified prior to data retrieval.

**Permissions:** Specific permissions are required to access this endpoint. Users must have the 'view_classes' permission assigned to their role. Without this permission, the endpoint will deny access to the requested information.

Upon receiving a request, the 'listMultipleSubjectsClassesRest' handler initiates by extracting and validating the input parameters from the request. It then invokes the 'listSubjectClasses' method from the academic portfolio's backend services, passing along necessary criteria for class filtration. This method interacts with the database to retrieve data about subject classes that match the given parameters. The process encapsulates error handling to ensure that any issues during data retrieval are managed, resulting in either a successful response with the data or an error message detailing the failure. The final response to the client is formatted as a JSON array containing the details about the classes, structured according to the specified requirements of the client-side application.`,
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
