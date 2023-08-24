export function getSources(t) {
  return [
    {
      label: t('sourceProgram'),
      value: 'program',
    },
    {
      label: t('sourceCourse'),
      value: 'course',
    },
    {
      label: t('sourceKnowledge'),
      value: 'knowledge',
    },
    {
      label: t('sourceSubject'),
      value: 'subject',
    },
    {
      label: t('sourceSubjectType'),
      value: 'subject-type',
    },
    {
      label: t('sourceSubjectGroup'),
      value: 'subject-group',
    },
  ];
}
