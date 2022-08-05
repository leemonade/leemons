/* eslint-disable no-param-reassign */
const _ = require('lodash');
const getAsset = require('../leebrary/assets/getAsset');

const intlOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };

async function getNextActivities(userAgents, table) {
  const now = new Date();
  const future = new Date();
  future.setTime(future.getTime() + 15 * 24 * 60 * 60 * 1000); // 15 dias
  // Sacamos las instancias cuya fecha de vencimiento es mayor a la actual y menor que dentro de 15 dias
  const instanceDates = await table.dates.find(
    {
      type: 'assignableInstance',
      name: 'deadline',
      $where: [
        { date_$gt: global.utils.sqlDatetime(now) },
        { date_$lt: global.utils.sqlDatetime(future) },
      ],
    },
    { columns: ['instance', 'date'] }
  );
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
  let assignations = await table.assignations.find(
    {
      instance_$in: instanceIds,
      user_$in: userAgents,
    },
    { columns: ['id', 'instance', 'user'] }
  );

  // Sacamos las asignaciones que tienen fecha de start
  const assignationDates = await table.dates.find({
    type: 'assignation',
    name: 'start',
    instance_$in: _.map(assignations, 'id'),
  });

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

async function getEvaluatedActivities(userAgents, table) {}

async function sendWeeklyEmails() {
  // eslint-disable-next-line global-require
  const table = require('../tables');
  const academicPortfolioServices = leemons.getPlugin('academic-portfolio').services;
  const emailsServices = leemons.getPlugin('emails').services;
  const leebraryServices = leemons.getPlugin('leebrary').services;
  const userServices = leemons.getPlugin('users').services;

  console.log('----------------------------------------------------');
  console.log('----------------------------------------------------');
  console.log('----------------------------------------------------');
  console.log('----------------------------------------------------');

  const userAgentIds = await emailsServices.config.getUserAgentsWithKeyValue('week-resume-email', {
    value: new Date().getDay().toString(),
  });

  const [{ userAgentInstances, instanceDatesByInstanceId }, evaluatedActivities] =
    await Promise.all([
      getNextActivities(userAgentIds, table),
      getEvaluatedActivities(userAgentIds, table),
    ]);

  let instanceIds = [];
  _.forIn(userAgentInstances, (value) => {
    instanceIds = instanceIds.concat(value);
  });

  instanceIds = _.uniq(instanceIds);

  const [hostname, instances, _classes, userAgents] = await Promise.all([
    userServices.platform.getHostname(),
    table.assignableInstances.find({
      id_$in: instanceIds,
    }),
    table.classes.find({
      assignableInstance_$in: instanceIds,
    }),
    // Sacamos el detalle de los user agent ya que lo necesitamos para enviar el email
    userServices.users.getUserAgentsInfo(userAgentIds, {
      withCenter: true,
      userColumns: ['id', 'email', 'locale'],
    }),
  ]);

  const [assignables, classes] = await Promise.all([
    table.assignables.find({
      id_$in: _.uniq(_.map(instances, 'assignable')),
    }),
    academicPortfolioServices.classes.classByIds(_.uniq(_.map(_classes, 'class'))),
  ]);

  const assets = await getAsset(_.map(assignables, 'asset'));

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

  _.forEach(userAgents, (userAgent) => {
    const hasNext = userAgentInstances[userAgent.id] && userAgentInstances[userAgent.id].length > 0;

    if (hasNext) {
      const nextInstances = [];

      if (hasNext) {
        const now = new Date();
        _.forEach(userAgentInstances[userAgent.id], (instanceId) => {
          const instance = instanceById[instanceId];
          const assignable = assignableById[instance.assignable];
          let timeUnit = 'hours';
          let timeColor = '#d13b3b';
          let time = global.utils.diffHours(now, new Date(instanceDatesByInstanceId[instance.id]));
          if (time > 24) {
            time = Math.floor(time / 24);
            timeUnit = 'days';
            if (time > 5) timeColor = '#E0914B';
            if (time > 10) timeColor = '#212B3D';
          }
          nextInstances.push({
            asset: {
              ...assetById[assignable.asset],
              url: hostname + leebraryServices.assets.getCoverUrl(assignable.asset),
            },
            classes: _.uniqBy(instanceClasses[instance.id], 'subject.id'),
            time,
            timeUnit,
            timeColor,
          });
        });

        nextInstances.push(_.cloneDeep(nextInstances[0]));
        nextInstances.push(_.cloneDeep(nextInstances[0]));
      }

      emailsServices.email
        .sendAsEducationalCenter(
          userAgent.user.email,
          'user-weekly-resume',
          userAgent.user.locale,
          {
            nextInstances,
            btnUrl: `${hostname}/private/assignables/ongoing`,
          },
          userAgent.center.id
        )
        .then(() => {
          console.log(`Weekly email sended to ${userAgent.user.email}`);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  });
}

module.exports = { sendWeeklyEmails };
