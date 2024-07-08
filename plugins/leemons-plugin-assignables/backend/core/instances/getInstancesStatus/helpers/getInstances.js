async function getInstances({ instancesIds, ctx }) {
  const pipeline = ({ ids }) => [
    {
      $match: {
        id: {
          $in: ids,
        },
        deploymentID: ctx.meta.deploymentID,
        isDeleted: false,
      },
    },
    {
      $lookup: {
        from: 'v1::assignables_dates',
        localField: 'id',
        foreignField: 'instance',
        as: 'dates',
        pipeline: [
          {
            $match: {
              type: 'assignableInstance',
            },
          },
        ],
      },
    },
    {
      $addFields: {
        dates: {
          $arrayToObject: {
            $map: {
              input: '$dates',
              as: 'date',
              in: {
                k: '$$date.name',
                v: '$$date.date',
              },
            },
          },
        },
      },
    },
    {
      $lookup: {
        from: 'v1::assignables_classes',
        localField: 'id',
        foreignField: 'assignableInstance',
        as: 'classes',
      },
    },
    {
      $addFields: {
        classes: {
          $map: {
            input: '$classes',
            as: 'class',
            in: '$$class.class',
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        instance: '$id',
        dates: '$dates',
        classes: '$classes',
        alwaysAvailable: '$alwaysAvailable',
        requiresScoring: '$requiresScoring',
        moduleActivities: '$metadata.module.activities',
      },
    },
  ];

  const instances = await ctx.tx.db.Instances.aggregate(pipeline({ ids: instancesIds, ctx }));

  const moduleActivitiesIds =
    instances.flatMap(
      (instance) => instance.moduleActivities?.map((activity) => activity.id) ?? []
    ) ?? [];

  const allInstancesIds = [...instancesIds, ...moduleActivitiesIds];

  const moduleActivities = await ctx.tx.db.Instances.aggregate(
    pipeline({ ids: moduleActivitiesIds, ctx })
  );
  instances.push(...moduleActivities);

  return { instances, instancesIds: allInstancesIds };
}

module.exports = getInstances;
