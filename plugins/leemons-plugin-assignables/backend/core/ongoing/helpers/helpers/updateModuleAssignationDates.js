const { map, keyBy, clone } = require('lodash');

function updateModuleAssignationDates({ assignations, dates }) {
  const assignationsByInstance = keyBy(assignations, 'instance.id');
  const datesToReturn = clone(dates);

  assignations.forEach((assignation) => {
    const activities = assignation.instance?.metadata?.module?.activities;
    if (activities?.length > 0) {
      const activitiesAssignations = map(
        activities,
        (activity) => assignationsByInstance[activity.id]
      );
      const assignationsDates = map(
        activitiesAssignations,
        (activityAssignation) => dates.assignations[activityAssignation?.id]
      );

      datesToReturn.assignations[assignation.id] = {
        open: assignationsDates[0]?.open ?? null,
        start: assignationsDates[0]?.start ?? null,
        end: assignationsDates.every((date) => date?.end) ? assignationsDates[0]?.end : null,
        ...dates.assignations[assignation.id],
      };
    }
  });
  return datesToReturn;
}

module.exports = {
  updateModuleAssignationDates,
};
