const dayjs = require('dayjs');

function getInstancesStatus(instances) {
  return instances.map((instance) => {
    const datesObj = instance.dates || {};
    const now = dayjs();
    const startDate = dayjs(datesObj.start || null);
    const deadline = dayjs(datesObj.deadline || null);
    const closedDate = dayjs(datesObj.closed || null);

    const isAlwaysAvailable = instance.alwaysAvailable;

    const isStarted = startDate.isValid() && !now.isBefore(startDate);
    const isDeadline = deadline.isValid() && !now.isBefore(deadline);
    const isClosed = closedDate.isValid() && !now.isBefore(closedDate);

    const isOpen = (isAlwaysAvailable || !isDeadline) && !isClosed;

    if (!isAlwaysAvailable && !isStarted) {
      return 'scheduled';
    }

    if (isOpen) {
      return 'open';
    }

    return 'closed';
  });
}
exports.getInstancesStatus = getInstancesStatus;
