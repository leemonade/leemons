const { schema } = require('./schemas/response/savePackageRest');
const { schema: xRequest } = require('./schemas/request/savePackageRest');

const openapi = {
  summary: 'Saves a SCORM package into the system',
  description: `This endpoint allows for the uploading and saving of a SCORM package into the platform. It ensures that the package is valid and stores it accordingly, making it accessible for deployment in user courses.

**Authentication:** Users must be authenticated to perform this operation. The endpoint requires a valid session or an authentication token to proceed with the request.

**Permissions:** Appropriate permissions are necessary to manage SCORM packages. Users need to have the 'manage_scorm_packages' permission to execute this action.

Upon receiving the request, the endpoint triggers the \`savePackage\` method in the SCORM package core module. This method takes charge of parsing the uploaded package data, validating its structure against the SCORM specifications, and saving it to the database. If the package meets all the necessary criteria, it is saved, and a success response is returned to the user. In cases where the validation fails, the endpoint responds with an error detailing the encountered issues. The entire process ensures data integrity and alignment with SCORM standards, centralized in a secure and systematic workflow.`,
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
