const openapi = {
  summary: "List of a teacher's classes",
  description: `
This endpoint provides a comprehensive list of classes assigned to a specific teacher. 

The list is paginated, and the page size and number can be specified in the request parameters. 

This feature is particularly useful for administrative purposes or for teachers to view their assigned classes. 

**Note:** To access this endpoint, the user must be authenticated and have either admin or view permissions in the "academic-portfolio.subjects" module.
    `,
};

module.exports = {
  listTeacherClassesRest: openapi,
};
