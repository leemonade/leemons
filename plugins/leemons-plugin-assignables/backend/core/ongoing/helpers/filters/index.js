const { filterInstancesByNotModule } = require('./filterInstancesByNotModule');
const { filterInstancesByRoleAndQuery } = require('./filterInstancesByRoleAndQuery');
const { filterInstancesByProgramAndSubjects } = require('./filterInstancesByProgramAndSubjects');
const { filterInstancesByStatusAndArchived } = require('./filterInstancesByStatusAndArchived');
const { filterAssignationsByInstance } = require('./filterAssignationsByInstance');
const { filterAssignationsByProgress } = require('./filterAssignationsByProgress');

module.exports = {
  filterAssignationsByInstance,
  filterAssignationsByProgress,
  filterInstancesByProgramAndSubjects,
  filterInstancesByStatusAndArchived,
  filterInstancesByNotModule,
  filterInstancesByRoleAndQuery,
};
