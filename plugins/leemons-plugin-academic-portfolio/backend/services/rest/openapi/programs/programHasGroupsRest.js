const { schema } = require('./schemas/response/programHasGroupsRest');
const { schema: xRequest } = require('./schemas/request/programHasGroupsRest');

const openapi = {
  summary: 'Determine the existence of program groups for a specific program',
  description: `This endpoint checks if a given academic program has associated program groups. It is used to verify group structuring within the context of academic portfolios, enabling organization and management features pertinent to program groups.

**Authentication:** Users need to be authenticated to query the existence of program groups for an academic program. Unauthenticated requests will be rejected.

**Permissions:** The user must have the appropriate permission to view information about program groups within academic portfolios.

Upon receiving a request, the endpoint initially validates the input to ensure a valid program identifier is provided. It then proceeds to call the \`getProgramGroups\` method from the core \`programs\` module, which performs a database query to find all associated program groups for the given program. The method evaluates whether there are any program groups linked to the program in question. The response from this method indicates either the presence or absence of such groups, which is then relayed back to the requester in a structured format, informing them of the program's status regarding group associations.`,
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
