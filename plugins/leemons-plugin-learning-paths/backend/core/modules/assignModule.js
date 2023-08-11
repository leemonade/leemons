const { omit, clone } = require('lodash');

module.exports = async function assignModule(
  { moduleId, config },
  { userSession, transacting: t, ctx }
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const { assignables: assignablesServices, assignableInstances: instancesServices } =
        leemons.getPlugin('assignables').services;

      const moduleAssignable = await assignablesServices.getAssignable(moduleId, {
        userSession,
        transacting,
      });

      const { activities } = moduleAssignable.submission;
      const activitiesInstanceIds = [];
      const blockingActivities = [];

      const activitiesCommonConfig = {
        ...omit(config.assignationForm, [
          'duration',
          'gradable',
          'requiresScoring',
          'allowFeedback',
          'curriculum',
          'sendMail',
          'messageToAssignees',
          'metadata',
        ]),
        gradable: false,
        requiresScoring: false,
        allowFeedback: false,
        curriculum: {},
        sendMail: false,
        messageToAssignees: null,
      };

      const moduleInstance = await instancesServices.createAssignableInstance(
        {
          ...config.assignationForm,
          metadata: {
            ...config.assignationForm.metadata,
            module: {
              type: 'module',
              activities: [],
            },
          },
          assignable: moduleId,
        },
        { userSession, transacting, ctx }
      );

      for (let i = 0, { length } = activities; i < length; i++) {
        const { activity, id } = activities[i];
        const activityConfig = config.activities[id];

        const previousActivityConfig = config.activities[activities[i - 1]?.id];
        const previousActivityId = activitiesInstanceIds[i - 1];

        const instanceConfig = {
          ...activitiesCommonConfig,
          ...activityConfig?.config,
          metadata: {
            ...activityConfig?.config?.metadata,
            module: {
              // The module id
              id: moduleInstance.id,
              // The internal module activity id
              activity: id,
              requirement: activityConfig?.state?.requirement,
              type: 'activity',
            },
          },
          relatedAssignableInstances: {
            before: !previousActivityId
              ? []
              : [
                {
                  id: previousActivityId,
                  required: previousActivityConfig?.state?.requirement === 'blocking',
                },
              ],
            blocking: clone(blockingActivities),
          },
          duration: activityConfig?.state?.duration ?? null,
          assignable: activity,
        };

        // eslint-disable-next-line no-await-in-loop
        const instanceCreated = await instancesServices.createAssignableInstance(instanceConfig, {
          userSession,
          transacting,
          ctx,
          createEvent: false,
        });

        if (activityConfig?.state?.requirement === 'blocking') {
          blockingActivities.push(instanceCreated.id);
        }

        activitiesInstanceIds.push(instanceCreated.id);
        /*
        1. Crear el objeto de asignación de la actividad
        2. Guardar el id de la asignación
        3. Tener en cuenta las dependencias, pues tendremos que usar el id del anterior

        Nota: De momento el requirement no es algo de assignables, por lo que usaremos el required: bool
      */
      }

      await instancesServices.updateAssignableInstance(
        {
          ...moduleInstance,
          metadata: {
            ...moduleInstance.metadata,
            module: {
              type: 'module',
              activities: activities.map((activity, i) => ({
                id: activitiesInstanceIds[i],
                requirement: config.activities[activity.id]?.state?.requirement,
              })),
            },
          },
        },
        {
          userSession,
          transacting,
        }
      );

      return {
        module: moduleInstance.id,
        activities: activities.map((activity, i) => ({
          id: activitiesInstanceIds[i],
          requirement: config.activities[activity.id]?.state?.requirement,
        })),
      };
    },
    'plugins_learning-paths::for-transactions',
    t
  );
};
