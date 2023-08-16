const _ = require('lodash');
const tables = require('../tables');

module.exports = async function getUserDataForFundae(userAgent, classes, { transacting } = {}) {
  if (this.calledFrom !== 'plugins.fundae')
    throw new Error('Only plugin fundae can call this function');

  const _assignations = await tables.assignations.find(
    {
      user: userAgent,
    },
    { transacting }
  );

  const _instanceIds = _.uniq(_.map(_assignations, 'instance'));

  const [_instances, classInstances] = await Promise.all([
    tables.assignableInstances.find({ id_$in: _instanceIds }, { transacting }),
    tables.classes.find(
      { assignableInstance_$in: _instanceIds, class_$in: classes },
      { transacting }
    ),
  ]);

  const instanceIds = _.uniq(_.map(classInstances, 'assignableInstance'));
  const instances = _.filter(_instances, (e) => instanceIds.includes(e.id));
  const assignations = _.filter(_assignations, (e) => instanceIds.includes(e.instance));
  const instanceById = _.keyBy(instances, 'id');
  const assignationIds = _.map(assignations, 'id');

  const [endDates, grades, assignables, _subjects] = await Promise.all([
    tables.dates.find(
      {
        name: 'end',
        type: 'assignation',
        instance_$in: assignationIds,
      },
      { transacting }
    ),
    tables.grades.find(
      {
        assignation_$in: assignationIds,
        type: 'main',
      },
      { transacting }
    ),
    tables.assignables.find({ id_$in: _.uniq(_.map(instances, 'assignable')) }, { transacting }),
    tables.subjects.find(
      { assignable_$in: _.uniq(_.map(instances, 'assignable')) },
      { transacting }
    ),
  ]);

  const assets = await leemons
    .getPlugin('leebrary')
    .services.assets.getByIds(_.map(assignables, 'asset'));

  const assetsById = _.keyBy(assets, 'id');
  const subjectsByAssignable = _.groupBy(_subjects, 'assignable');
  const assignablesById = _.keyBy(assignables, 'id');
  const endDatesByAssignation = _.keyBy(endDates, 'instance');

  const endDatesGradables = [];
  const endDatesNoGradables = [];
  const gradables = [];
  const noGradables = [];

  _.forEach(assignations, (assignation) => {
    const instance = instanceById[assignation.instance];
    const assignable = assignablesById[instance.assignable];
    if (assignable) {
      const asset = assetsById[assignable.asset];
      const toSave = assignation;
      const date = endDatesByAssignation[assignation.id];
      const subjects = _.map(subjectsByAssignable[assignable.id], 'subject');
      if (instance.gradable) {
        if (date) endDatesGradables.push(date);
        gradables.push({ ...toSave, instance, assignable, endDate: date, asset, subjects });
      } else {
        if (date) endDatesNoGradables.push(date);
        noGradables.push({ ...toSave, instance, assignable, endDate: date, asset, subjects });
      }
    }
  });

  return {
    grades,
    endDates,
    gradables,
    noGradables,
    endDatesGradables,
    endDatesNoGradables,
  };
};
