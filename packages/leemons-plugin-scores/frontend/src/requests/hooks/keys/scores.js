export const allScoresKey = [
  {
    plugin: 'plugin.scores',
    scope: 'scores',
  },
];

export const allScoresSearchKey = [
  {
    ...allScoresKey[0],
    action: 'search',
  },
];

export const scoresSearchKey = ({ students, classes, gradedBy, periods, published }) => [
  {
    ...allScoresSearchKey[0],

    students,
    classes,
    gradedBy,
    periods,
    published,
  },
];
