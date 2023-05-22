const dayjs = require('dayjs');
const { getInstancesStatus } = require('../activitiesStatus');

function filterInstancesByStatusAndArchived({ instances, filters, dates, hideNonVisible }) {
  const { status: desiredStatus } = filters;

  const filterByStatus = ['open', 'closed', 'scheduled'].includes(desiredStatus);
  const filterByArchived = filters.isArchived !== undefined;

  let filteredInstances = instances;
  const datesPerInstance = dates.instances;

  // EN: Filter instances by visibility date for students
  // ES: Filtrar instancias por fecha de visibilidad para estudiantes
  if (hideNonVisible) {
    filteredInstances = filteredInstances.filter((instance) => {
      const { visualization, start } = datesPerInstance[instance.id] || {};
      const { alwaysAvailable } = instance;
      const now = dayjs();
      const visualizationDate = dayjs(visualization || null);
      const startDate = dayjs(start || null);

      return (
        alwaysAvailable ||
        (startDate.isValid() && !now.isBefore(startDate)) ||
        (visualizationDate.isValid() && !now.isBefore(visualizationDate))
      );
    });
  }

  if (!filterByArchived && !filterByStatus) {
    return instances;
  }

  if (filterByStatus) {
    const instancesWithDates = instances.map((instance) => ({
      id: instance.id,
      alwaysAvailable: instance.alwaysAvailable,
      dates: datesPerInstance[instance.id],
    }));
    const instancesStatus = getInstancesStatus(instancesWithDates);
    const instancesIdsToReturn = {};

    instancesStatus
      .map((status, i) => ({
        status,
        instance: instances[i],
      }))
      .filter(({ status }) => status === desiredStatus)
      .forEach((instance) => {
        instancesIdsToReturn[instance.instance.id] = true;
      });

    filteredInstances = filteredInstances.filter((instance) => !!instancesIdsToReturn[instance.id]);
  }

  if (filterByArchived) {
    const isArchived = [true, 'true', 1, '1'].includes(filters.isArchived);

    filteredInstances = filteredInstances.filter((instance) => {
      const now = dayjs();
      const archivedDate = dayjs(datesPerInstance[instance.id]?.archived || null);

      const instanceIsArchived = archivedDate.isValid() && !now.isBefore(archivedDate);

      return isArchived ? instanceIsArchived : !instanceIsArchived;
    });
  }

  return filteredInstances;
}
module.exports = { filterInstancesByStatusAndArchived };
