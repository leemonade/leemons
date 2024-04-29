const { schema } = require('./schemas/response/deleteProgramRest');
const { schema: xRequest } = require('./schemas/request/deleteProgramRest');

const openapi = {
  summary: 'Delete specified academic programs',
  description: `This endpoint allows for the deletion of one or more academic programs based on their unique identifiers. The deletion process removes the program entries and associated entities such as courses, groups, and student records from the academic portfolio system.

**Authentication:** Users need to be authenticated to initiate deletion requests. Requests lacking proper authentication will be rejected, ensuring secure access to resource modifications.

**Permissions:** Administrative-level permissions are required to delete academic programs. Users must have specific roles or privileges that grant them rights to alter or remove academic records, ensuring adherence to institutional policies.

Upon receiving a request, the endpoint verifies user authentication and permissions. If these checks are satisfactory, it proceeds to call the \`removeProgramByIds\` method. This method coordinates with various service layers to ensure all related records, such as courses tied to the programs, are also identified and deleted. This comprehensive approach ensures data integrity and frees up resources previously allocated to the now-deleted programs. After successful deletion, a confirmation is sent back to the requestor indicating the status of the deletion process.`,
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
