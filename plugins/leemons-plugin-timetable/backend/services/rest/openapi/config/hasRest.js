const { schema } = require('./schemas/response/hasRest');
const { schema: xRequest } = require('./schemas/request/hasRest');

const openapi = {
  summary: 'Check configuration existence for a specified key',
  description: `This endpoint verifies the existence of a configuration item identified by a specific key within the Leemons SaaS platform's timetable plugin. It is designed to quickly confirm whether a given configuration parameter has been set.

**Authentication:** User authentication is required to access this endpoint. Any requests lacking proper authorization will be rejected.

**Permissions:** Specific permission checks are conducted to ensure that only users with the appropriate rights can verify the existence of configuration keys. Users without sufficient permissions will not be allowed to perform this action.

Upon handling the request, the \`hasRest\` action calls the \`has\` method in the \`config\` core. This method performs an internal lookup to ascertain whether the specified configuration key is present in the system's configuration store. If found, the method returns a truthy value, effectively indicating the existence of the key. The endpoint translates this return value into an appropriate HTTP response, conveying the existence status of the queried configuration key back to the requestor.`,
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
