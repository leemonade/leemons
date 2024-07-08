const { isNil } = require('lodash');
const dayjs = require('dayjs');

const { getInstanceDates } = require('./getInstanceDates');

function filterByDeadline(query, deadline, now) {
  if (deadline && (query.deadline_$lt || query.deadline_$gt)) {
    return !(
      (!query.deadline_$lt || !dayjs(deadline).isAfter(query.deadline_$lt)) &&
      (!query.deadline_$gt || !dayjs(deadline).isBefore(query.deadline_$gt))
    );
  }

  return (
    (query.deadline && (!deadline || dayjs(deadline).isAfter(now))) ||
    (query.deadline === false && deadline && !dayjs(deadline).isAfter(now))
  );
}

function filterByClosed(query, closed, now) {
  return (
    (query.closed && (!closed || dayjs(closed).isAfter(now))) ||
    (query.closed === false && closed && !dayjs(closed).isAfter(now))
  );
}

function filterByOpened(query, start, now) {
  return (
    (query.opened && start && dayjs(start).isAfter(now)) ||
    (query.opened === false && start && !dayjs(start).isAfter(now))
  );
}

function filterByArchived(query, archived, now) {
  return (
    (query.archived && (!archived || dayjs(archived).isAfter(now))) ||
    (query.archived === false && archived && !dayjs(archived).isAfter(now))
  );
}

function filterByFinished(query, closed, deadline) {
  if (query.finished) {
    const from = dayjs(query.finished_$gt || null)
      .set('hours', 0)
      .set('minutes', 0)
      .set('seconds', 0);
    const to = dayjs(query.finished_$lt || null)
      .set('hours', 23)
      .set('minutes', 59)
      .set('seconds', 59);

    if (from.isValid() && to.isValid()) {
      const deadlineDate = dayjs(deadline || null);
      const closeDate = dayjs(closed || null);
      if (
        (!deadlineDate.isValid() && !closeDate.isValid()) ||
        deadlineDate.isBefore(from) ||
        deadlineDate.isAfter(to) ||
        closeDate.isBefore(from) ||
        closeDate.isAfter(to)
      ) {
        return true;
      }
    }
  }
  return false;
}

function filterByVisible(query, start, visualization, now) {
  // EN: If no visualization date is set, it is assumed that the instance is visible when started.
  // ES: Si no se establece una fecha de visibilidad, se asume que la instancia es visible cuando se inicia.
  return (
    (query.visible && visualization && dayjs(visualization).isAfter(now)) ||
    (query.visible && !visualization && start && dayjs(start).isAfter(now)) ||
    (query.visible === false && visualization && !dayjs(visualization).isAfter(now)) ||
    (query.visible === false && start && !dayjs(start).isAfter(now))
  );
}

function filterAlwaysAvailableByAssignmentDate(query, dates) {
  const isAlwaysAvailable = !dates?.start && !dates?.deadline;

  if (isAlwaysAvailable && (query.alwaysAvailable_$lt || query.alwaysAvailable_$gt)) {
    return !(
      (!query.alwaysAvailable_$lt || !dayjs(dates.createdAt).isAfter(query.alwaysAvailable_$lt)) &&
      (!query.alwaysAvailable_$gt || !dayjs(dates.createdAt).isBefore(query.alwaysAvailable_$gt))
    );
  }

  return false;
}

function filterInstancesWithDates(query, _instancesWithDates) {
  const instancesWithDates = _instancesWithDates;
  const now = dayjs();

  Object.entries(instancesWithDates).forEach(
    ([instanceId, { start, closed, archived, visualization, deadline, createdAt }]) => {
      if (filterByDeadline(query, deadline, now)) {
        delete instancesWithDates[instanceId];
        return;
      }

      if (filterByClosed(query, closed, now)) {
        delete instancesWithDates[instanceId];
        return;
      }

      if (filterByOpened(query, start, now)) {
        delete instancesWithDates[instanceId];
        return;
      }

      if (filterByArchived(query, archived, now)) {
        delete instancesWithDates[instanceId];
        return;
      }

      if (filterByFinished(query, closed, deadline)) {
        delete instancesWithDates[instanceId];
        return;
      }

      if (filterByVisible(query, start, visualization, now)) {
        delete instancesWithDates[instanceId];
        return;
      }

      if (filterAlwaysAvailableByAssignmentDate(query, { start, deadline, createdAt })) {
        delete instancesWithDates[instanceId];
      }
    }
  );

  return instancesWithDates;
}

/**
 * Filters an array of assignable instance IDs based on the provided query parameters and instance dates.
 *
 * @param {Object} options - The options object.
 * @param {Object} options.query - The query parameters to filter the assignable instances.
 * @param {Array} options.assignableInstancesIds - The array of assignable instance IDs to be filtered.
 * @param {MoleculerContext} options.ctx - The Moleculer context object.
 * @returns {Array} - The filtered array of assignable instance IDs.
 */
async function filterByInstanceDates({ query, assignableInstancesIds, ctx }) {
  if (
    !(
      isNil(query.closed) ||
      isNil(query.opened) ||
      isNil(query.archived) ||
      isNil(query.visible) ||
      isNil(query.finished) ||
      isNil(query.deadline_$lt) ||
      isNil(query.deadline_$gt) ||
      isNil(query.alwaysAvailable_$lt) ||
      isNil(query.alwaysAvailable_$gt)
    )
  ) {
    return assignableInstancesIds;
  }

  let instancesWithDates = await getInstanceDates({ instances: assignableInstancesIds, ctx });
  const instancesWithoutDates = assignableInstancesIds.filter((id) => !instancesWithDates[id]);
  instancesWithDates = filterInstancesWithDates(query, instancesWithDates);

  if (query.archived === true || query.finished) {
    // EN: If an instance does not have dates, it is assumed that it is not archived not finished.
    // ES: Si una instancia no tiene fechas, se asume que no está archivada ni finalizada.
    return [...Object.keys(instancesWithDates)];
  }

  return [...Object.keys(instancesWithDates), ...instancesWithoutDates];
}

module.exports = { filterByInstanceDates };
