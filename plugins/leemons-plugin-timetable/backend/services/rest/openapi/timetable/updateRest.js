const { schema } = require('./schemas/response/updateRest');
const { schema: xRequest } = require('./schemas/request/updateRest');

const openapi = {
  summary: 'Update timetable details',
  description: `This endpoint updates specific details within a timetable. Depending on the request, it can modify aspects like event times, participants, or other related metadata of a timetable entry.

**Authentication:** Users need to be authenticated to update a timetable. Access to this endpoint requires valid user credentials, which must be verified before any modification can proceed.

**Permissions:** User must have edit permissions for the timetable they attempt to update. Unauthorized access attempts will result in an error and no changes will be made to the timetable.

The process within the controller starts by validating the incoming data against predefined schemas to ensure all required fields are present and correctly formatted. Next, the \`updateTimetable\` method within the \`timetables\` core uses this validated data to update the specified timetable entry in the data repository. This involves complex transactions like date calculations and potential conflict resolutions with existing timetable entries. After successful data modification, a response is sent back confirming the updates, or in the case of errors, detailed error messages are returned.`,
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
