const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');

async function getUserDataForFundae({ userAgent, classes, ctx }) {
  if (ctx.callerPlugin !== 'fundae')
    throw new LeemonsError(ctx, {
      message: 'Only plugin fundae can call this function',
    });

  const _assignations = await ctx.tx.db.Assignations.find({
    user: userAgent,
  }).lean();

  const _instanceIds = _.uniq(_.map(_assignations, 'instance'));

  const [_instances, classInstances] = await Promise.all([
    ctx.tx.db.Instances.find({ id: _instanceIds }).lean(),
    ctx.tx.db.Classes.find({
      assignableInstance: _instanceIds,
      class: classes,
    }).lean(),
  ]);

  const instanceIds = _.uniq(_.map(classInstances, 'assignableInstance'));
  const instances = _.filter(_instances, (e) => instanceIds.includes(e.id));
  const assignations = _.filter(_assignations, (e) => instanceIds.includes(e.instance));
  const instanceById = _.keyBy(instances, 'id');
  const assignationIds = _.map(assignations, 'id');

  const [endDates, grades, assignables, _subjects] = await Promise.all([
    ctx.tx.db.Dates.find({
      name: 'end',
      type: 'assignation',
      instance: assignationIds,
    }).lean(),
    ctx.tx.db.Grades.find({
      assignation: assignationIds,
      type: 'main',
    }).lean(),
    ctx.tx.db.Assignables.find({
      id: _.uniq(_.map(instances, 'assignable')),
    }).lean(),
    ctx.tx.db.Subjects.find({
      assignable: _.uniq(_.map(instances, 'assignable')),
    }).lean(),
  ]);

  const assets = await ctx.tx.call('leebrary.assets.getByIds', {
    ids: _.map(assignables, 'asset'),
  });

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
        gradables.push({
          ...toSave,
          instance,
          assignable,
          endDate: date,
          asset,
          subjects,
        });
      } else {
        if (date) endDatesNoGradables.push(date);
        noGradables.push({
          ...toSave,
          instance,
          assignable,
          endDate: date,
          asset,
          subjects,
        });
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
}

module.exports = { getUserDataForFundae };
