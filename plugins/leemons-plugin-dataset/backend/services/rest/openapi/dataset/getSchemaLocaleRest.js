const { schema } = require('./schemas/response/getSchemaLocaleRest');
const { schema: xRequest } = require('./schemas/request/getSchemaLocaleRest');

const openapi = {
  summary: 'Fetch localized schema information',
  description: `This endpoint retrieves the schema definitions for datasets, localized to the currently set or specified locale. It primarily serves to provide clients such as frontend applications with the necessary configuration and definition to handle datasets correctly according to the localization settings.

**Authentication:** Users must be authenticated to access localized schema information. Any requests without a valid session or authentication credentials will be denied access to this endpoint.

**Permissions:** Users need specific permissions to fetch localized schema information; typically, this includes roles or rights that allow access to dataset management or administrative capabilities within the application.

Upon receiving a request, the \`getSchemaLocaleRest\` handler executes a sequence of operations to fetch and return the requested schema information. It begins by validating the request parameters, ensuring the requested locale is supported. It then queries the underlying database using the \`DatasetSchemaLocale\` service to get the relevant localized schema data. The final response includes the schema configuration in a JSON format, tailored to the locale preferences of the requesting user.`,
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
