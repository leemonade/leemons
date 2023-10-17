const { uniq, map, groupBy, union } = require('lodash');

async function filterInstancesByStudentCompletionPercentage({
  instances,
  min = 0,
  max = 100,
  includeMin,
  includeMax,
  excludeStudentsFullyEvaluated,
  instanceSubjectsProgramsAndClasses,
  ctx,
}) {
  const uniqInstancesIds = uniq(map(instances, 'id'));

  const assignations = await ctx.tx.db.Assignations.find({
    instance: uniqInstancesIds,
  })
    .select(['id', 'instance'])
    .lean();

  const assignationsIds = map(assignations, 'id');

  const [assignationsGrades, assignationsDates] = await Promise.all([
    !excludeStudentsFullyEvaluated
      ? []
      : ctx.tx.db.Grades.find({
          type: 'main',
          assignation: assignationsIds,
        })
          .select(['id', 'subject', 'assignation'])
          .lean(),

    ctx.tx.db.Dates.find({
      type: 'assignation',
      instance: assignationsIds,
      name: 'end',
    })
      .select(['id', 'instance', 'date'])
      .lean(),
  ]);

  const gradesPerAssignation = groupBy(assignationsGrades, 'assignation');
  const datesPerAssignation = groupBy(assignationsDates, 'instance');
  const assignationsPerInstance = {};

  assignations.forEach((assignation) => {
    assignationsPerInstance[assignation.instance] = union(
      assignationsPerInstance[assignation.instance],
      [assignation.id]
    );
  });

  return instances.filter((instance) => {
    const subjectsCount = instanceSubjectsProgramsAndClasses?.[instance.id]?.subjects?.length || 0;
    const students = assignationsPerInstance[instance.id] ?? [];
    const studentsCount = students.length;
    const studentsWhoFinished = students
      .map((studentAssignation) => ({
        hasFinished: !!datesPerAssignation[studentAssignation],
        isFullyEvaluated:
          gradesPerAssignation[studentAssignation]?.length === subjectsCount && subjectsCount > 0,
      }))
      .filter((student) => student.hasFinished && !student.isFullyEvaluated).length;

    const completionPercentage = studentsWhoFinished / studentsCount;

    if (includeMin) {
      return min === completionPercentage;
    }
    if (includeMax) {
      return max === completionPercentage;
    }
    return min < completionPercentage && max > completionPercentage;
  });
}

module.exports = {
  filterInstancesByStudentCompletionPercentage,
};
