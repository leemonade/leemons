const { schema } = require('./schemas/response/postClassRest');
const { schema: xRequest } = require('./schemas/request/postClassRest');

const openapi = {
  summary: 'Add new class entry to the academic portfolio',
  description: `This endpoint facilitates the addition of a new class entry into the academic portfolio system, effectively allowing the system to track and organize classes as part of an educational institution's offerings.

**Authentication:** User authentication is required to ensure that only authorized personnel can add class entries. Users must be logged in and have a valid session token to proceed.

**Permissions:** This action requires administrative rights or specific role-based permissions associated with academic management and entry modification. Proper permission checks are enforced to prevent unauthorized modifications.

Upon receiving a request, the endpoint invokes the \`addClass\` method from the academic portfolio module. This method internally validates the provided data against predefined schemas and checks for the existence of necessary attributes such as course identifiers and subject details. After validation, the entry is created in the database, and a confirmation is sent back to the requester indicating successful addition or providing error messages in case of failure. The process ensures data integrity and aligns with the institution’s academic structure and rules.`,
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
