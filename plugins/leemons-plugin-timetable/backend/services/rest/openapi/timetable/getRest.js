const { schema } = require('./schemas/response/getRest');
const { schema: xRequest } = require('./schemas/request/getRest');

const openapi = {
  summary: 'Provides a timetable based on user-defined filters and rules',
  description: `This endpoint retrieves a user-specific timetable based on predefined filters and rules. The timetable includes classes, timeslots, and potentially other relevant academic resources that are configured per user or group requirements.

**Authentication:** User authentication is required to ensure secure access to the pertinent timetable data. An unauthorized or expired session will prevent access to this endpoint.

**Permissions:** This endpoint requires the 'view_timetable' permission. Users without this permission will not be able to retrieve timetable information.

Upon request, the endpoint initially invokes the 'get' method from \`timetables\` core, which uses the \`timeFiltersQuery\` helper to process input filters and query parameters. These parameters define user-specific needs such as class times, preferred days, and any other relevant filters. The 'get' method interacts with the database to fetch timetable data that matches the specified criteria. The processed data is then formatted suitably and returned as a JSON object, providing a structured response that includes all timetable entries relevant to the user.`,
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
