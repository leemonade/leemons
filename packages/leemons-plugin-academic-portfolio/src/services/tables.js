const table = {
  class: leemons.query('plugins_academic-portfolio::class'),
  classCourse: leemons.query('plugins_academic-portfolio::class-course'),
  classGroup: leemons.query('plugins_academic-portfolio::class-group'),
  classStudent: leemons.query('plugins_academic-portfolio::class-student'),
  classTeacher: leemons.query('plugins_academic-portfolio::class-teacher'),
  configs: leemons.query('plugins_academic-portfolio::configs'),
  groupProgram: leemons.query('plugins_academic-portfolio::group-program'),
  groups: leemons.query('plugins_academic-portfolio::groups'),
  programCenter: leemons.query('plugins_academic-portfolio::program-center'),
  programSubstage: leemons.query('plugins_academic-portfolio::program-substage'),
  programs: leemons.query('plugins_academic-portfolio::programs'),
  subjectTypes: leemons.query('plugins_academic-portfolio::subject-types'),
  subjects: leemons.query('plugins_academic-portfolio::subjects'),
  knowledges: leemons.query('plugins_academic-portfolio::knowledges'),
};

module.exports = { table };
