// TODO [Importante]: Añadir autenticación y permisos
module.exports = [
  // Curriculum
  {
    path: '/data-for-keys',
    method: 'POST',
    handler: 'curriculum.getDataForKeys',
    authenticated: true,
  },
  {
    path: '/curriculum',
    method: 'POST',
    handler: 'curriculum.postCurriculum',
    authenticated: true,
  },
  {
    path: '/curriculum',
    method: 'GET',
    handler: 'curriculum.listCurriculum',
    authenticated: true,
  },
  {
    path: '/curriculum/:id/generate',
    method: 'POST',
    handler: 'curriculum.generateCurriculum',
    authenticated: true,
  },
  {
    path: '/curriculum/:id/publish',
    method: 'POST',
    handler: 'curriculum.publishCurriculum',
    authenticated: true,
  },
  {
    path: '/curriculum/:id',
    method: 'DELETE',
    handler: 'curriculum.deleteCurriculum',
    authenticated: true,
  },
  {
    path: '/curriculum/:id',
    method: 'POST',
    handler: 'curriculum.getCurriculum',
    authenticated: true,
  },
  // NodeLevels
  {
    path: '/node-levels',
    method: 'POST',
    handler: 'nodeLevel.postNodeLevels',
    authenticated: true,
  },
  {
    path: '/node-levels',
    method: 'PUT',
    handler: 'nodeLevel.putNodeLevel',
    authenticated: true,
  },
  // Nodes
  {
    path: '/node',
    method: 'POST',
    handler: 'nodes.postNode',
    authenticated: true,
  },
  {
    path: '/node',
    method: 'PUT',
    handler: 'nodes.saveNode',
    authenticated: true,
  },
];
