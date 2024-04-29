const { schema } = require('./schemas/response/removeRest');
const { schema: xRequest } = require('./schemas/request/removeRest');

const openapi = {
  summary: 'Remove a specified family record',
  description: `This endpoint removes a specific family entity from the database based on the provided family ID. It ensures that all associated data such as family members and any linked profiles are also updated or deleted appropriately to maintain database integrity.

**Authentication:** Users need to be authenticated to perform deletion operations. The endpoint checks for a valid user session or token before proceeding with the removal process.

**Permissions:** The user must have administrative rights or specific permissions set to delete family records. Without sufficient privileges, the request will be denied.

The removal process initiates by first verifying the existence of the family through the \`exists\` validation method which checks for the family's presence in the database. Upon successful validation, the \`remove\` method from the \`families\` core is called with necessary parameters such as the family ID. This method handles the deletion of the family record and triggers supplementary actions like removing related dataset values through \`removeDatasetValues\` method and updating or deleting associated family members using \`removeMember\` method. Each step ensures the comprehensive cleanup of all data linked to the family entity, culminating in a structured response that confirms the removal outcome.`,
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
