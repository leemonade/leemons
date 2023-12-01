const { schema } = require('./schemas/response/getRest');
const { schema: xRequest } = require('./schemas/request/getRest');

const openapi = {
  summary: 'Fetches the timetable based on specified criteria',
  description: `This endpoint is responsible for retrieving the time schedule for classes, events, or other planned activities within the educational institution's system. It is designed to filter and present the timetable based on various criteria such as date ranges, specific classes, or instructors.

**Authentication:** Authentication is mandatory for accessing this endpoint. Users must have a valid session or token to retrieve timetable data.

**Permissions:** Specific permissions related to accessing timetables or schedule information are required. Users may be restricted to viewing only those timetables relevant to their role or assigned classes within the institution.

Upon receiving a request, the endpoint initiates the \`get\` method from the \`timetables\` core, which orchestrates the retrieval process. This method may utilize helper utilities like \`timeFiltersQuery\` to build the database query according to the provided filter parameters. Once the query is constructed, it fetches the relevant timetable entries from the database. Subsequently, the method processes and structures the data before returning it to the user. The entire flow is managed to ensure that the user receives an accurate and up-to-date timetable reflecting the current schedule as it stands in the educational institution's system.`,
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
