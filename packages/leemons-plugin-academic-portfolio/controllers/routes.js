// TODO: Añadir autenticación y permisos
module.exports = [
  // Programs
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
  // Knowledges
  {
    path: '/knowledge',
    method: 'POST',
    handler: 'knowledge.postKnowledge',
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
    path: '/subject',
    method: 'GET',
    handler: 'subject.listSubject',
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
    path: '/class',
    method: 'POST',
    handler: 'class.postClass',
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
  // Student
  {
    path: '/student/:id/classes',
    method: 'GET',
    handler: 'class.listStudentClasses',
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
];
