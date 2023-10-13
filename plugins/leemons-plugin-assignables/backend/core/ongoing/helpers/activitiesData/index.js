const { getTeacherInstances } = require('./getTeacherInstances');
const { getInstancesData } = require('./getInstancesData');
const { getAssignablesData } = require('./getAssignablesData');
const { getAssetsData } = require('./getAssetsData');
const { getActivitiesDates } = require('./getActivitiesDates');
const {
  getInstanceSubjectsProgramsAndClasses,
} = require('./getInstanceSubjectsProgramsAndClasses');

module.exports = {
  getActivitiesDates,
  getInstanceSubjectsProgramsAndClasses,
  getStudentAssignations: () => null,
  getInstancesData,
  getTeacherInstances,
  getAssignablesData,
  getAssetsData,
};
