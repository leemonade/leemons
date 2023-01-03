const dayjs = require('dayjs');
const { getInstancesStatus } = require('../activitiesStatus');

function filterInstancesByStatusAndArchived({ instances, filters, dates }) {
  const { status: desiredStatus } = filters;

  const filterByStatus = ['open', 'closed', 'scheduled'].includes(desiredStatus);
  const filterByArchived = filters.isArchived !== undefined;

  if (!filterByArchived && !filterByStatus) {
    return instances;
  }

  const datesPerInstance = dates.instances;
  let filteredInstances = instances;

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
