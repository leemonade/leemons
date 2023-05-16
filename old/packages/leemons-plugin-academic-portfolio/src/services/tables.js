const table = {
  class: leemons.query('plugins_academic-portfolio::class'),
  classCourse: leemons.query('plugins_academic-portfolio::class-course'),
  classGroup: leemons.query('plugins_academic-portfolio::class-group'),
  classKnowledges: leemons.query('plugins_academic-portfolio::class-knowledges'),
  classSubstage: leemons.query('plugins_academic-portfolio::class-substage'),
  classStudent: leemons.query('plugins_academic-portfolio::class-student'),
  classTeacher: leemons.query('plugins_academic-portfolio::class-teacher'),
  configs: leemons.query('plugins_academic-portfolio::configs'),
  groups: leemons.query('plugins_academic-portfolio::groups'),
  programCenter: leemons.query('plugins_academic-portfolio::program-center'),
  programs: leemons.query('plugins_academic-portfolio::programs'),
  subjectTypes: leemons.query('plugins_academic-portfolio::subject-types'),
  subjects: leemons.query('plugins_academic-portfolio::subjects'),
  knowledges: leemons.query('plugins_academic-portfolio::knowledges'),
  programSubjectsCredits: leemons.query('plugins_academic-portfolio::program-subjects-credits'),
  settings: leemons.query('plugins_academic-portfolio::settings'),
  managers: leemons.query('plugins_academic-portfolio::managers'),
  cycles: leemons.query('plugins_academic-portfolio::cycles'),
};

module.exports = { table };
