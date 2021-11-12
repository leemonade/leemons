// TODO: Añadir autenticación y permisos
module.exports = [
  // Programs
  {
    path: '/program',
    method: 'POST',
    handler: 'program.postProgram',
  },
  {
    path: '/program',
    method: 'GET',
    handler: 'program.listProgram',
  },
  {
    path: '/program/:id',
    method: 'GET',
    handler: 'program.detailProgram',
  },
  {
    path: '/program/:id/has/courses',
    method: 'GET',
    handler: 'program.programHasCourses',
  },
  {
    path: '/program/:id/has/groups',
    method: 'GET',
    handler: 'program.programHasGroups',
  },
  {
    path: '/program/:id/has/substages',
    method: 'GET',
    handler: 'program.programHasSubstages',
  },
  {
    path: '/program/:id/courses',
    method: 'GET',
    handler: 'program.programCourses',
  },
  {
    path: '/program/:id/groups',
    method: 'GET',
    handler: 'program.programGroups',
  },
  {
    path: '/program/:id/substages',
    method: 'GET',
    handler: 'program.programSubstages',
  },
  // Knowledges
  {
    path: '/knowledge',
    method: 'POST',
    handler: 'knowledge.postKnowledge',
  },
  {
    path: '/knowledge',
    method: 'GET',
    handler: 'knowledge.listKnowledge',
  },
  // Subject types
  {
    path: '/subject-type',
    method: 'POST',
    handler: 'subjectType.postSubjectType',
  },
  {
    path: '/subject-type',
    method: 'PUT',
    handler: 'subjectType.putSubjectType',
  },
  {
    path: '/subject-type',
    method: 'GET',
    handler: 'subjectType.listSubjectType',
  },
  // Courses
  {
    path: '/course',
    method: 'POST',
    handler: 'course.postCourse',
  },
  {
    path: '/course',
    method: 'PUT',
    handler: 'course.putCourse',
  },
  {
    path: '/course',
    method: 'GET',
    handler: 'course.listCourse',
  },
  // Groups
  {
    path: '/group',
    method: 'POST',
    handler: 'group.postGroup',
  },
  {
    path: '/group',
    method: 'PUT',
    handler: 'group.putGroup',
  },
  {
    path: '/group',
    method: 'GET',
    handler: 'group.listGroup',
  },
  // Subjects
  {
    path: '/subject',
    method: 'POST',
    handler: 'subject.postSubject',
  },
  {
    path: '/subject',
    method: 'PUT',
    handler: 'subject.putSubject',
  },
  {
    path: '/subject/credits',
    method: 'PUT',
    handler: 'subject.putSubjectCredits',
  },
  {
    path: '/subject/credits',
    method: 'GET',
    handler: 'subject.getSubjectCredits',
  },
  {
    path: '/subject',
    method: 'GET',
    handler: 'subject.listSubject',
  },
  // Class
  {
    path: '/class',
    method: 'POST',
    handler: 'class.postClass',
  },
  {
    path: '/class',
    method: 'PUT',
    handler: 'class.putClass',
  },
  {
    path: '/class',
    method: 'GET',
    handler: 'class.listClass',
  },
  // Common
  {
    path: '/class-subjects',
    method: 'GET',
    handler: 'common.listClassSubjects',
  },
  {
    path: '/tree',
    method: 'GET',
    handler: 'common.getTree',
  },
];
