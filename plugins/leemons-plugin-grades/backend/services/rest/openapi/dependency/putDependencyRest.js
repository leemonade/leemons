const { schema } = require('./schemas/response/putDependencyRest');
const { schema: xRequest } = require('./schemas/request/putDependencyRest');

const openapi = {
  summary: 'Update dependency relationships for a specific grading rule',
  description: `This endpoint facilitates the updating of dependency relationships between different grading rules within the system. It is primarily used to adjust how various grading conditions impact one another, thereby modifying their execution sequence based on new or existing dependencies.

**Authentication:** User authentication is mandatory for accessing this endpoint. Without proper authentication credentials, the request will be denied.

**Permissions:** The user must possess adequate permissions related to grade management or rule adjustments. Specific permission checks are applied to ensure only authorized users can modify dependency rules.

The \`putDependencyRest\` handler commences by verifying user authentication and permissions. Subsequently, it fetches and analyzes the input data which comprises identifiers of grading rules and their new dependencies. This operation involves retrieving existing rules from the database, removing old dependencies, and establishing the new specified dependencies, facilitated by corresponding methods in the backend logic. The process encompasses validations to prevent circular dependencies and to ensure data integrity. Upon successful update, the system confirms modifications and provides a response indicating the successful restructuring of the grading rules' dependencies.`,
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
