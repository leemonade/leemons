/* eslint-disable no-param-reassign */
const _ = require('lodash');

const { sqlDatetime, diffHours } = require('@leemons/utils');

const { getAsset } = require('../leebrary/assets/getAsset');

async function getNextActivities({ userAgents, ctx }) {
  const now = new Date();
  const future = new Date();
  future.setTime(future.getTime() + 15 * 24 * 60 * 60 * 1000); // 15 dias
  // Sacamos las instancias cuya fecha de vencimiento es mayor a la actual y menor que dentro de 15 dias
  const instanceDates = await ctx.tx.db.Dates.find({
    type: 'assignableInstance',
    name: 'deadline',
    date: { $gt: sqlDatetime(now), $lt: sqlDatetime(future) },
  })
    .select(['instance', 'date'])
    .lean();
  const instanceIds = _.map(instanceDates, 'instance');
  const instanceDatesByInstanceId = _.reduce(
    instanceDates,
    (acc, { instance, date }) => {
      acc[instance] = date;
      return acc;
    },
    {}
  );

  // Sacamos las asignaciones que tienen los usuarios
  let assignations = await ctx.tx.db.Assignations.find({
    instance: instanceIds,
    user: userAgents,
  })
    .select(['id', 'instance', 'user'])
    .lean();

  // Sacamos las asignaciones que tienen fecha de start
  const assignationDates = await ctx.tx.db.Dates.find({
    type: 'assignation',
    name: 'start',
    instance: _.map(assignations, 'id'),
  }).lean();

  // Borramos las asignaciones sacadas que ya estan empezadas
  const startedAssignations = _.map(assignationDates, 'instance');
  assignations = _.filter(
    assignations,
    (assignation) => !_.includes(startedAssignations, assignation.id)
  );

  const userAgentInstances = _.reduce(
    assignations,
    (acc, { instance, user }) => {
      if (!acc[user]) acc[user] = [];
      acc[user].push(instance);
      return acc;
    },
    {}
  );

  return {
    userAgentInstances,
    instanceDatesByInstanceId,
  };
}

async function getEvaluatedActivities({ userAgents, ctx }) {
  const past = new Date();
  past.setTime(past.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 dias
  const grades = await ctx.tx.db.Grades.find({
    type: 'main',
    date: { $gt: sqlDatetime(past) },
  })
    .select(['assignation', 'grade'])
    .lean();
  const gradesByAssignationId = _.groupBy(grades, 'assignation');
  const assignationIds = _.uniq(_.map(grades, 'assignation'));
  const assignationFinished = await ctx.tx.db.Dates.find({
    type: 'assignation',
    name: 'end',
    instance: assignationIds,
  }).lean();
  const assignationFinishedIds = _.map(assignationFinished, 'instance');
  const assignations = await ctx.tx.db.Assignations.find({
    id: assignationFinishedIds,
    user: userAgents,
  })
    .select(['id', 'instance', 'user'])
    .lean();
  return _.reduce(
    assignations,
    (acc, { id, instance, user }) => {
      if (!acc[user]) acc[user] = [];
      let note = 0;
      _.forEach(gradesByAssignationId[id], ({ grade }) => {
        note += grade;
      });
      note /= gradesByAssignationId[id].length;
      acc[user].push({
        instance,
        note,
      });
      return acc;
    },
    {}
  );
}

async function createEvaluatedInstance({
  instanceId,
  note,
  instanceById,
  assignableById,
  assetById,
  instanceClasses,
  hostnameApi,
  hostname,
  ctx,
}) {
  const instance = instanceById[instanceId];
  const assignable = assignableById[instance.assignable];
  const url =
    (hostnameApi || hostname) +
    (await ctx.tx.call('leebrary.assets.getCoverUrl', {
      assetId: assignable.asset,
    }));

  return {
    asset: {
      ...assetById[assignable.asset],
      url,
    },
    classes: _.uniqBy(instanceClasses[instance.id], 'subject.id'),
    note: note.toFixed(2),
  };
}

async function createNextInstance({
  assetById,
  assignableById,
  hostname,
  hostnameApi,
  instanceById,
  instanceClasses,
  instanceDatesByInstanceId,
  instanceId,
  now,
  ctx,
}) {
  const instance = instanceById[instanceId];
  const assignable = assignableById[instance.assignable];
  let timeUnit = 'hours';
  let timeColor = '#d13b3b';
  let time = diffHours(now, new Date(instanceDatesByInstanceId[instance.id]));
  if (time > 24) {
    time = Math.floor(time / 24);
    timeUnit = 'days';
    if (time > 5) timeColor = '#E0914B';
    if (time > 10) timeColor = '#212B3D';
  }
  const url =
    (hostnameApi || hostname) +
    (await ctx.tx.call('leebrary.assets.getCoverUrl', {
      assetId: assignable.asset,
    }));

  return {
    asset: {
      ...assetById[assignable.asset],
      url,
    },
    classes: _.uniqBy(instanceClasses[instance.id], 'subject.id'),
    time,
    timeUnit,
    timeColor,
  };
}

async function sendWeeklyEmails({ ctx }) {
  const userAgentIds = await ctx.tx.call('emails.config.getUserAgentsWithKeyValue', {
    key: 'week-resume-email',
    value: new Date().getDay().toString(),
  });

  const [{ userAgentInstances, instanceDatesByInstanceId }, evaluatedActivities] =
    await Promise.all([
      getNextActivities({ userAgents: userAgentIds, ctx }),
      getEvaluatedActivities({ userAgents: userAgentIds, ctx }),
    ]);

  let instanceIds = [];
  _.forIn(userAgentInstances, (value) => {
    instanceIds = instanceIds.concat(value);
  });

  _.forIn(evaluatedActivities, (values) => {
    _.forIn(values, (value) => {
      instanceIds.push(value.instance);
    });
  });

  instanceIds = _.uniq(instanceIds);

  const [hostname, hostnameApi, instances, _classes, userAgents] = await Promise.all([
    ctx.tx.call('users.platform.getHostname'),
    ctx.tx.call('users.platform.getHostnameApi'),
    ctx.tx.db.Instances.find({
      id: instanceIds,
    }).lean(),
    ctx.tx.db.Classes.find({
      assignableInstance: instanceIds,
    }).lean(),
    // Sacamos el detalle de los user agent ya que lo necesitamos para enviar el email
    ctx.tx.call('users.users.getUserAgentsInfo', {
      userAgentIds: _.uniq(userAgentIds),
      withCenter: true,
      userColumns: ['id', 'email', 'locale'],
    }),
  ]);

  const [assignables, classes] = await Promise.all([
    ctx.tx.db.Assignables.find({
      id: _.uniq(_.map(instances, 'assignable')),
    }).lean(),
    ctx.tx.call('academic-portfolio.classes.classByIds', {
      ids: _.uniq(_.map(_classes, 'class')),
    }),
  ]);

  const assets = await getAsset({ id: _.map(assignables, 'asset'), ctx });

  const assetById = _.keyBy(assets, 'id');
  const classesById = _.keyBy(classes, 'id');
  const instanceById = _.keyBy(instances, 'id');
  const assignableById = _.keyBy(assignables, 'id');

  const instanceClasses = _.reduce(
    _classes,
    (acc, { assignableInstance, class: classe }) => {
      if (!acc[assignableInstance]) acc[assignableInstance] = [];
      if (_.map(acc[assignableInstance], 'id').indexOf(classe) === -1) {
        acc[assignableInstance].push(classesById[classe]);
      }
      return acc;
    },
    {}
  );

  const promises = _.map(userAgents, async (userAgent) => {
    const hasEvaluated =
      evaluatedActivities[userAgent.id] && evaluatedActivities[userAgent.id].length > 0;
    const hasNext = userAgentInstances[userAgent.id] && userAgentInstances[userAgent.id].length > 0;

    if (hasNext || hasEvaluated) {
      let nextInstances = [];
      let evaluatedInstances = [];

      if (hasEvaluated) {
        const evaluatedActivitiesPromises = _.map(
          evaluatedActivities[userAgent.id],
          async ({ instance: instanceId, note }) =>
            createEvaluatedInstance({
              instanceId,
              note,
              instanceById,
              assignableById,
              assetById,
              instanceClasses,
              hostnameApi,
              hostname,
              ctx,
            })
        );

        evaluatedInstances = await Promise.all(evaluatedActivitiesPromises);
      }

      if (hasNext) {
        const now = new Date();
        const nextInstancesPromises = _.map(userAgentInstances[userAgent.id], async (instanceId) =>
          createNextInstance({
            assetById,
            assignableById,
            hostname,
            hostnameApi,
            instanceById,
            instanceClasses,
            instanceDatesByInstanceId,
            instanceId,
            now,
            ctx,
          })
        );

        nextInstances = await Promise.all(nextInstancesPromises);
      }

      await ctx.tx
        .call('emails.email.sendAsEducationalCenter', {
          to: userAgent.user.email,
          templateName: 'user-weekly-resume',
          language: userAgent.user.locale,
          context: {
            evaluatedInstances,
            nextInstances,
            btnUrl: `${hostname}/private/assignables/ongoing`,
          },
          centerId: userAgent.center.id,
        })
        .then(() => {
          ctx.logger.debug(`Weekly email sended to ${userAgent.user.email}`);
        })
        .catch((e) => {
          ctx.logger.error(e);
        });
    }
  });
  await Promise.all(promises);
}

module.exports = { sendWeeklyEmails };
