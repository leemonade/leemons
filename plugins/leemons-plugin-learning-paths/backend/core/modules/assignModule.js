const { omit, clone } = require('lodash');

module.exports = async function assignModule({ moduleId, config, ctx }) {
  const moduleAssignable = await ctx.tx.call('assignables.assignables.getAssignable', {
    id: moduleId,
  });

  const unsortedActivities = moduleAssignable.submission.activities?.filter(
    (activity) => !config.activities[activity.id]?.state?.deleted
  );

  const activities = config.order
    ? unsortedActivities?.sort((a, b) => config.order[a.id] - config.order[b.id])
    : unsortedActivities;

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

  const moduleInstance = await ctx.tx.call(
    'assignables.assignableInstances.createAssignableInstance',
    {
      assignableInstance: {
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
    }
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

    if (activityConfig?.config?.metadata?.isAsset) {
      // eslint-disable-next-line no-await-in-loop
      const assignable = await ctx.tx.call('leebrary.assignables.updateForModules', {
        instance: instanceConfig,
      });

      instanceConfig.assignable = assignable.id;
    }

    // eslint-disable-next-line no-await-in-loop
    const instanceCreated = await ctx.tx.call(
      'assignables.assignableInstances.createAssignableInstance',
      {
        assignableInstance: instanceConfig,
        createEvent: false,
      }
    );

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

  await ctx.tx.call('assignables.assignableInstances.updateAssignableInstance', {
    assignableInstance: {
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
  });

  return {
    module: moduleInstance.id,
    activities: activities.map((activity, i) => ({
      id: activitiesInstanceIds[i],
      requirement: config.activities[activity.id]?.state?.requirement,
    })),
  };
};
