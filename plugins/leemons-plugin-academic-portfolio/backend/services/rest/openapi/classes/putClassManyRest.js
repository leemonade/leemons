const { schema } = require('./schemas/response/putClassManyRest');
const { schema: xRequest } = require('./schemas/request/putClassManyRest');

const openapi = {
  summary: 'Update multiple class records',
  description: `This endpoint facilitates the bulk updating of class records in the system. It is specifically designed to handle multiple updates at once, enhancing efficiency and minimizing the need for repetitive API calls for individual updates.

**Authentication:** Users need to be authentically signed in to access this endpoint. Any attempt to access it without proper authentication will be denied.

**Permissions:** This function requires the user to have 'edit_class_records' permission to update class details. Without this permission, the request will be rejected.

Upon receiving the request, this endpoint initiates the \`updateClassMany\` service action. This action accepts an array of class objects, each containing updated information and an identifier for each class. The method iterates through each object, applying updates where the identifiers match existing records. This process involves validating the new data against existing schema rules to ensure consistency and data integrity. After successful updates, a summary of the affected records (e.g., number of classes updated) is sent back in the HTTP response. This allows clients to verify the extent of changes made.`,
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
