const { filterInstancesByNotModule } = require('./filterInstancesByNotModule');
const { filterInstancesByRoleAndQuery } = require('./filterInstancesByRoleAndQuery');

module.exports = {
  filterAssignationsByInstance: () => null,
  filterAssignationsByProgress: () => null,
  filterInstancesByProgramAndSubjects: () => null,
  filterInstancesByStatusAndArchived: () => null,
  filterInstancesByNotModule,
  filterInstancesByRoleAndQuery,
};
