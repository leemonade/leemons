const _ = require('lodash');
const { sendEmail } = require('./sendEmail');
const { dates } = require('../tables');
const getAssignableInstance = require('./getAssignableInstance');

module.exports = async function sendReminder(
  { assignableInstanceId, users, type },
  { userSession, transacting, ctx } = {}
) {
  const userServices = leemons.getPlugin('users').services;
  const academicPortfolioServices = leemons.getPlugin('academic-portfolio').services;

  const [instance, hostname, hostnameApi] = await Promise.all([
    getAssignableInstance.call(this, assignableInstanceId, {
      userSession,
      details: true,
      transacting,
    }),
    userServices.platform.getHostname(),
    userServices.platform.getHostnameApi(),
  ]);

  const userAgentIds = _.map(instance.students, 'user');
  let finalUsers = users && users.length ? users : userAgentIds;

  if (type) {
    const assignationIds = _.map(instance.students, 'id');
    const assignationsById = _.keyBy(instance.students, 'id');
    const dats = await dates.find({
      type: 'assignation',
      instance_$in: assignationIds,
      name: type,
    });
    const assignationIdsToSend = _.map(dats, 'instance');
    const finalAssignationIds = _.difference(assignationIds, assignationIdsToSend);

    finalUsers = [];
    _.forEach(finalAssignationIds, (assignationId) => {
      finalUsers.push(assignationsById[assignationId].user);
    });
  }

  const [classesData, userAgents] = await Promise.all([
    academicPortfolioServices.classes.classByIds(instance.classes, {
      withTeachers: true,
      userSession,
      transacting,
    }),
    userServices.users.getUserAgentsInfo(finalUsers, {
      withCenter: true,
      userColumns: ['id', 'email', 'locale'],
      transacting,
    }),
  ]);

  const _classes = _.uniqBy(classesData, 'subject.id');

  const promises = [];
  _.forEach(userAgents, (userAgent) => {
    promises.push(
      sendEmail({
        instance,
        userAgent,
        classes: _classes,
        userSession,
        ctx,
        hostname,
        hostnameApi,
        ignoreUserConfig: true,
        isReminder: true,
      })
    );
  });

  return Promise.all(promises);
};
