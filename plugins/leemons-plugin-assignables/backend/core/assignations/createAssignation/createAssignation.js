const { uniqBy, keyBy } = require('lodash');

const { validateAssignation } = require('../../helpers/validators/assignation');
const { getInstance } = require('../../instances/getInstance');
const scheduleEmail = require('../../instances/sendEmail/scheduleEmail');

const { createComunicaRooms } = require('./helpers/createComunicaRooms');
const {
  throwIfAnyUserIsAlreadyAssignedToInstance,
} = require('./helpers/throwIfAnyUserIsAlreadyAssignedToInstance');

async function createAssignation({ assignableInstanceId, users, options, ctx }) {
  validateAssignation(
    {
      instance: assignableInstanceId,
      users,
      ...options,
    },
    { useRequired: true }
  );

  await throwIfAnyUserIsAlreadyAssignedToInstance({
    users,
    instance: assignableInstanceId,
    ctx,
  });

  const instance = await getInstance({ id: assignableInstanceId, details: true, ctx });
  const { indexable, classes, group, status, metadata } = options;

  // Create assignations
  const assignationsToCreate = users.map((user) => ({
    instance: assignableInstanceId,
    indexable: indexable || true,
    user,
    classes: JSON.stringify(classes || []),
    group,
    status,
    metadata: JSON.stringify(metadata),
  }));
  const createdAssignations = await ctx.tx.db.Assignations.insertMany(assignationsToCreate);

  // Manage dependencies
  const shouldCreateComunicaRooms =
    instance.metadata.createComunicaRooms && (instance.requiresScoring || instance.allowFeedback);
  const shouldSendMail = instance.sendMail;

  let classesData;
  if (shouldCreateComunicaRooms || shouldSendMail) {
    classesData = await ctx.tx.call('academic-portfolio.classes.classByIds', {
      ids: instance.classes,
      withTeachers: true,
    });
  }

  // Comunica
  if (shouldCreateComunicaRooms) {
    await createComunicaRooms({
      instance,
      classes: classesData,
      users,
      createdAssignations,
      ctx,
    });
  }

  // Emails
  if (shouldSendMail) {
    const userAgents = await ctx.tx.call('users.users.getUserAgentsInfo', {
      userAgentIds: users,
      userColumns: ['id', 'email', 'avatar', 'locale'],
      withCenter: true,
    });

    scheduleEmail({
      instance,
      userAgents,
      classes: uniqBy(classesData, 'subject.id'),
      ctx,
    });
  }
}

module.exports = { createAssignation };
