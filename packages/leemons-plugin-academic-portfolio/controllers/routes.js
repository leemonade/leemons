// TODO [Importante]: Añadir autenticación y permisos
const {
  permissions: { names: permissions },
} = require('../config/constants');

const getPermissions = (permissionsArr, actions = null) => {
  if (Array.isArray(permissionsArr)) {
    return permissionsArr.reduce(
      (obj, [permission, _actions]) => ({
        ...obj,
        [permission]: {
          actions: _actions.includes('admin') ? _actions : ['admin', ..._actions],
        },
      }),
      {}
    );
  }
  return {
    [permissionsArr]: {
      actions: actions.includes('admin') ? actions : ['admin', ...actions],
    },
  };
};

module.exports = [
  // Programs
  {
    path: '/user/programs',
    method: 'GET',
    handler: 'program.getUserPrograms',
    authenticated: true,
  },
  {
    path: '/program',
    method: 'PUT',
    handler: 'program.putProgram',
    authenticated: true,
  },
  {
    path: '/program',
    method: 'POST',
    handler: 'program.postProgram',
    authenticated: true,
  },
  {
    path: '/program',
    method: 'GET',
    handler: 'program.listProgram',
    authenticated: true,
  },
  {
    path: '/program/have',
    method: 'GET',
    handler: 'program.havePrograms',
    authenticated: true,
  },
  {
    path: '/program/:id/tree',
    method: 'GET',
    handler: 'program.getProgramTree',
    authenticated: true,
  },
  {
    path: '/program/:id/duplicate',
    method: 'POST',
    handler: 'program.duplicateProgram',
    authenticated: true,
  },
  {
    path: '/program/:id',
    method: 'GET',
    handler: 'program.detailProgram',
    authenticated: true,
  },
  {
    path: '/program/:id/evaluation-system',
    method: 'GET',
    handler: 'program.getProgramEvaluationSystem',
    authenticated: true,
  },
  {
    path: '/program/:id/has/courses',
    method: 'GET',
    handler: 'program.programHasCourses',
    authenticated: true,
  },
  {
    path: '/program/:id/has/groups',
    method: 'GET',
    handler: 'program.programHasGroups',
    authenticated: true,
  },
  {
    path: '/program/:id/has/substages',
    method: 'GET',
    handler: 'program.programHasSubstages',
    authenticated: true,
  },
  {
    path: '/program/:id/courses',
    method: 'GET',
    handler: 'program.programCourses',
    authenticated: true,
  },
  {
    path: '/program/:id/groups',
    method: 'GET',
    handler: 'program.programGroups',
    authenticated: true,
  },
  {
    path: '/program/:id/substages',
    method: 'GET',
    handler: 'program.programSubstages',
    authenticated: true,
  },
  {
    path: '/program/:id',
    method: 'DELETE',
    handler: 'program.deleteProgram',
    authenticated: true,
  },
  {
    path: '/program/add-students-to-classes-under-node-tree',
    method: 'POST',
    handler: 'program.addStudentsToClassesUnderNodeTree',
    authenticated: true,
  },

  // Knowledges
  {
    path: '/knowledge',
    method: 'POST',
    handler: 'knowledge.postKnowledge',
    authenticated: true,
  },
  {
    path: '/knowledge',
    method: 'PUT',
    handler: 'knowledge.putKnowledge',
    authenticated: true,
  },
  {
    path: '/knowledge',
    method: 'GET',
    handler: 'knowledge.listKnowledge',
    authenticated: true,
  },
  // Subject types
  {
    path: '/subject-type',
    method: 'POST',
    handler: 'subjectType.postSubjectType',
    authenticated: true,
  },
  {
    path: '/subject-type',
    method: 'PUT',
    handler: 'subjectType.putSubjectType',
    authenticated: true,
  },
  {
    path: '/subject-type',
    method: 'GET',
    handler: 'subjectType.listSubjectType',
    authenticated: true,
  },
  // Courses
  {
    path: '/course',
    method: 'POST',
    handler: 'course.postCourse',
    authenticated: true,
  },
  {
    path: '/course',
    method: 'PUT',
    handler: 'course.putCourse',
    authenticated: true,
  },
  {
    path: '/course',
    method: 'GET',
    handler: 'course.listCourse',
    authenticated: true,
  },
  // Groups
  {
    path: '/group',
    method: 'POST',
    handler: 'group.postGroup',
    authenticated: true,
  },
  {
    path: '/group',
    method: 'PUT',
    handler: 'group.putGroup',
    authenticated: true,
  },
  {
    path: '/group',
    method: 'GET',
    handler: 'group.listGroup',
    authenticated: true,
  },
  {
    path: '/group-from-classes-under-node-tree',
    method: 'DELETE',
    handler: 'group.deleteGroupFromClassesUnderNodeTree',
    authenticated: true,
  },
  {
    path: '/group/:id/duplicate-with-classes-under-node-tree',
    method: 'POST',
    handler: 'group.duplicateGroupWithClassesUnderNodeTree',
    authenticated: true,
  },
  {
    path: '/group/duplicate',
    method: 'POST',
    handler: 'group.duplicateGroup',
    authenticated: true,
  },
  // Subjects
  {
    path: '/subject',
    method: 'POST',
    handler: 'subject.postSubject',
    authenticated: true,
  },
  {
    path: '/subject',
    method: 'PUT',
    handler: 'subject.putSubject',
    authenticated: true,
  },
  {
    path: '/subject/credits',
    method: 'PUT',
    handler: 'subject.putSubjectCredits',
    authenticated: true,
  },
  {
    path: '/subject/credits',
    method: 'GET',
    handler: 'subject.getSubjectCredits',
    authenticated: true,
  },
  {
    path: '/subject/credits/list',
    method: 'GET',
    handler: 'subject.listSubjectCreditsForProgram',
    authenticated: true,
  },
  {
    path: '/subject',
    method: 'GET',
    handler: 'subject.listSubject',
    authenticated: true,
  },
  {
    path: '/subject/:id',
    method: 'GET',
    handler: 'subject.subjectByIds',
    authenticated: true,
  },
  // Class
  {
    path: '/class',
    method: 'GET',
    handler: 'class.listClass',
    authenticated: true,
  },
  {
    path: '/classes/have',
    method: 'GET',
    handler: 'class.haveClasses',
    authenticated: true,
  },
  {
    path: '/class',
    method: 'POST',
    handler: 'class.postClass',
    authenticated: true,
  },
  {
    path: '/class/:id',
    method: 'DELETE',
    handler: 'class.removeClass',
    authenticated: true,
  },
  {
    path: '/class/dashboard/:id',
    method: 'GET',
    handler: 'class.classDetailForDashboard',
    authenticated: true,
  },
  {
    path: '/class',
    method: 'PUT',
    handler: 'class.putClass',
    authenticated: true,
  },
  {
    path: '/class/many',
    method: 'PUT',
    handler: 'class.putClassMany',
    authenticated: true,
  },
  {
    path: '/class/students',
    method: 'POST',
    handler: 'class.postClassStudents',
    authenticated: true,
  },
  {
    path: '/class/teachers',
    method: 'POST',
    handler: 'class.postClassTeachers',
    authenticated: true,
  },
  {
    path: '/class/remove/students',
    method: 'POST',
    handler: 'class.removeStudent',
    authenticated: true,
  },
  // Student
  {
    path: '/student/:id/classes',
    method: 'GET',
    handler: 'class.listStudentClasses',
    authenticated: true,
  },
  {
    path: '/session/classes',
    method: 'POST',
    handler: 'class.listSessionClasses',
    authenticated: true,
  },
  // Teacher
  {
    path: '/teacher/:id/classes',
    method: 'GET',
    handler: 'class.listTeacherClasses',
    authenticated: true,
  },
  // Class instance
  {
    path: '/class/instance',
    method: 'POST',
    handler: 'class.postClassInstance',
    authenticated: true,
  },
  // Common
  {
    path: '/class-subjects',
    method: 'GET',
    handler: 'common.listClassSubjects',
    authenticated: true,
  },
  {
    path: '/tree',
    method: 'GET',
    handler: 'common.getTree',
    authenticated: true,
  },
  {
    path: '/classes-under-node-tree',
    method: 'GET',
    handler: 'common.getClassesUnderNodeTree',
    authenticated: true,
  },
  {
    path: '/add-students-to-classes-under-node-tree',
    method: 'POST',
    handler: 'common.addStudentsToClassesUnderNodeTree',
    authenticated: true,
  },
  {
    path: '/add-teachers-to-classes-under-node-tree',
    method: 'POST',
    handler: 'common.addTeachersToClassesUnderNodeTree',
    authenticated: true,
  },
  {
    path: '/students/by/tags',
    method: 'POST',
    handler: 'common.getStudentsByTags',
    authenticated: true,
  },
  {
    path: '/settings',
    method: 'GET',
    handler: 'settings.findOne',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.portfolio, ['view']),
  },
  {
    path: '/settings',
    method: 'POST',
    handler: 'settings.update',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.portfolio, ['edit']),
  },
  {
    path: '/settings/enable-menu-item',
    method: 'POST',
    handler: 'settings.enableMenuItem',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.portfolio, ['edit']),
  },
  {
    path: '/settings/profiles/is-config',
    method: 'GET',
    handler: 'settings.isProfilesConfig',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.profiles, ['view']),
  },
  {
    path: '/settings/profiles',
    method: 'GET',
    handler: 'settings.getProfiles',
    authenticated: true,
    // allowedPermissions: getPermissions(permissions.profiles, ['view']),
  },
  {
    path: '/settings/profiles',
    method: 'PUT',
    handler: 'settings.setProfiles',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.profiles, ['create', 'update']),
  },
];
