const { schema } = require('./schemas/response/saveMultipleFieldsRest');
const {
  schema: xRequest,
} = require('./schemas/request/saveMultipleFieldsRest');

const openapi = {
  summary: 'Saves multiple fields in a dataset schema',
  description: `This endpoint is responsible for the creation or update of multiple fields within a specific dataset schema in the system. It handles complex operations where multiple field definitions need to be saved simultaneously, ensuring data integrity and compliance with the dataset's structure.

**Authentication:** The user needs to be authenticated to perform this operation. The system will validate the user's credentials and session to authorize the request.

**Permissions:** Users must have 'edit' permissions on the dataset schema to add or update fields. Permissions are checked against the user's role and privileges prior to processing the request.

Upon receiving the request, the handler initially validates the provided field data against the existing dataset schema format. It then interacts with the \`saveMultipleFields\` method in the backend dataset schema core, which is designed to handle updates or additions of multiple fields efficiently. This method processes each field individually, applying validation rules, handling data conversion, and ensuring that no conflicts occur with existing field definitions. After successful execution, the system updates the dataset schema in the data store, reflecting the changes made. A response is then generated to indicate the success of the operation, or failure details in case of an error.`,
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
