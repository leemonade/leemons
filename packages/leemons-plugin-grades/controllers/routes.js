module.exports = [
  // Grades
  {
    path: '/grades',
    method: 'GET',
    handler: 'grades.listGrades',
    authenticated: true,
  },
  {
    path: '/grades',
    method: 'POST',
    handler: 'grades.postGrade',
    authenticated: true,
  },
  {
    path: '/grades',
    method: 'PUT',
    handler: 'grades.putGrade',
    authenticated: true,
  },
  {
    path: '/grades/:id',
    method: 'GET',
    handler: 'grades.getGrade',
    authenticated: true,
  },
  {
    path: '/grades/:id',
    method: 'DELETE',
    handler: 'grades.removeGrade',
    authenticated: true,
  },
  // Grade Scales
  {
    path: '/grade-scales',
    method: 'POST',
    handler: 'grade-scales.postGradeScale',
    authenticated: true,
  },
  {
    path: '/grade-scales',
    method: 'PUT',
    handler: 'grade-scales.putGradeScale',
    authenticated: true,
  },
  {
    path: '/grade-scales/:id',
    method: 'DELETE',
    handler: 'grade-scales.removeGradeScale',
    authenticated: true,
  },
  // Grade Tags
  {
    path: '/grade-tags',
    method: 'POST',
    handler: 'grade-tags.postGradeTag',
    authenticated: true,
  },
  {
    path: '/grade-tags',
    method: 'PUT',
    handler: 'grade-tags.putGradeTag',
    authenticated: true,
  },
  {
    path: '/grade-tags/:id',
    method: 'DELETE',
    handler: 'grade-tags.removeGradeTag',
    authenticated: true,
  },
  // Rules
  {
    path: '/rules',
    method: 'POST',
    handler: 'rules.postRule',
    authenticated: true,
  },
  {
    path: '/rules',
    method: 'PUT',
    handler: 'rules.putRule',
    authenticated: true,
  },
  {
    path: '/rules/:id',
    method: 'DELETE',
    handler: 'rules.deleteRule',
    authenticated: true,
  },
  {
    path: '/rules/process',
    method: 'POST',
    handler: 'rules.postRuleProcess',
    authenticated: true,
  },
  // Dependencies
  {
    path: '/dependencies',
    method: 'POST',
    handler: 'dependency.postDependency',
    authenticated: true,
  },
  {
    path: '/dependencies',
    method: 'PUT',
    handler: 'dependency.putDependency',
    authenticated: true,
  },
  {
    path: '/dependencies/:id',
    method: 'DELETE',
    handler: 'dependency.deleteDependency',
    authenticated: true,
  },
];
