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
    method: 'GET',
    handler: 'subjectType.listSubjectType',
  },
];
