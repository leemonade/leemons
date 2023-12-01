const { schema } = require('./schemas/response/rollCallRest');
const { schema: xRequest } = require('./schemas/request/rollCallRest');

const openapi = {
  summary: 'Manages attendance roll call',
  description: `This endpoint is responsible for the management of attendance within a given context. It allows users to record and update attendance information for individuals or groups, ensuring accurate tracking of participation in various events or sessions.

**Authentication:** Users must be authenticated to access and modify attendance data. An invalid or missing authentication token will result in denial of access to the endpoint.

**Permissions:** Users require specific permissions to interact with the attendance data. The exact permissions depend on the level of access needed, such as read-only or the ability to make changes to the attendance records.

Upon receiving a request, the \`rollCallRest\` handler validates user authentication and checks for the necessary permissions. Once authorized, it interacts with the attendance management system's core functions. It may invoke methods such as \`recordAttendance\` or \`updateAttendance\`, which handle the actual logging and modifications of the attendance data based on parameters provided in the request. The endpoint processes these functions sequentially or in parallel, as needed, and once the attendance data is successfully updated or an error is encountered, a relevant HTTP response is generated and sent back to the client.`,
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
