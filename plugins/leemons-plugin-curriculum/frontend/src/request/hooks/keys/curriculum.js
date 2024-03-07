export const allCurriculumScopeKey = [
  {
    plugin: 'plugin.curriculum',
    scope: 'curriculum',
  },
];

export const allListCurriculumsByProgramKey = [
  {
    ...allCurriculumScopeKey[0],
    action: 'getByProgram',
    entity: 'list',
  },
];

export const listCurriculumsByProgramKey = ({ program }) => [
  {
    ...allListCurriculumsByProgramKey[0],

    program,
  },
];

export const allCurriculumDetailKey = [
  {
    ...allCurriculumScopeKey[0],
    action: 'get',
    entity: 'curriculum',
  },
];

export const curriculumDetailKey = ({ id }) => [
  {
    ...allCurriculumDetailKey[0],
    id,
  },
];
