const { schema } = require('./schemas/response/putNodeLevelRest');
const { schema: xRequest } = require('./schemas/request/putNodeLevelRest');

const openapi = {
  summary: 'Update node level details',
  description: `This endpoint allows updating of specific node level details within the Leemons platform curriculum management. The modifications can include changes to the hierarchy, labeling, or any associated attributes of a node level.

**Authentication:** Users must be authenticated to modify node level details. Actions performed without valid authentication will result in access denial.

**Permissions:** Users need to have \`edit_node_level\` permission to update details of a node level. Attempts to update without sufficient permissions will be blocked and logged for security audits.

Upon receiving a request, the endpoint initiates the \`updateNodeLevel\` method from the \`nodeLevels\` core module. This method utilizes the passed data (typically in JSON format), which includes the specific changes to be made, along with the unique identifier of the node level. The procedure involves validation of the data against predefined schemas to ensure compliance with the platform's data standards. If validations pass, the method proceeds to apply the updates in the database. The success or failure of the operation, along with updated data if successful, is then conveyed back to the user through a standardized HTTP response.`,
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
