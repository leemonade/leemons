const { schema } = require('./schemas/response/getOverlapsRest');
const { schema: xRequest } = require('./schemas/request/getOverlapsRest');

const openapi = {
  summary: 'Identify overlapping board message configurations',
  description: `This endpoint checks for overlapping configurations in board messages. It is primarily used to prevent the scheduling of messages that may conflict with existing board configurations, ensuring clear and non-overlapping communication channels across various boards.

**Authentication:** Users need to be authenticated to access this functionality. Authentication verifies user identity and ensures that actions performed are attributed to a specific and authorized user.

**Permissions:** Appropriate permissions are required to access this endpoint. Users must have administrative or appropriate roles that grant them access to configure or manage board messages and their underlying settings.

The endpoint initiates by calling the \`getOverlapsWithOtherConfigurations\` method from the \`messages\` module. This method attempts to analyze the incoming configuration against the database records of other configurations to identify any overlaps. It sorts these configurations based on pre-established criteria to prioritize newer timestamps or critical configurations. After processing, the method returns detailed information about any overlaps found, which includes data such as timestamps, affected message IDs, and the specifics of the overlap. This data is then passed back through the response payload in JSON format, providing comprehensive insights to the requester about any potential conflicts in board message scheduling.`,
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
