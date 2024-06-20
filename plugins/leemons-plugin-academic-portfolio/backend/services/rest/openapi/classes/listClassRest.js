const { schema } = require('./schemas/response/listClassRest');
const { schema: xRequest } = require('./schemas/request/listClassRest');

const openapi = {
  summary: 'Lists all classes available to the user based on specific criteria',
  description: `This endpoint provides a list of all academic classes that are available or relevant to the user, filtered based on specific criteria such as department, program, and academic level. The list can include classes the user is teaching, enrolled in, or has permissions to view.

**Authentication:** User authentication is required to access the list of classes. Only authenticated users can query the class details, ensuring that sensitive educational information remains protected.

**Permissions:** This endpoint requires the user to have teaching, enrollment, or administrative permissions related to the classes they wish to view. Access is denied if the user lacks appropriate permissions for the requested classes.

From the initial HTTP request to the response, the \`listClassesRest\` method begins by verifying the user's authentication and permissions. It then proceeds to gather the classes by calling the \`listClasses\` method from the academic portfolio services. This method uses filters provided in the request to retrieve relevant class data from the database. The retrieved data is then formatted appropriately and sent back to the user in the form of a JSON structured response, providing a comprehensive list of classes tailored to the user's accessibility and criteria.`,
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
