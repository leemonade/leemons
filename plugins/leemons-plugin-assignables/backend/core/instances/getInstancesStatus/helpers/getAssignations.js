const { keyBy } = require('lodash');

async function getAssignations({ instancesIds, isStudent, ctx }) {
  const pipeline = ({ ids }) => [
    {
      $match: {
        isDeleted: false,
        instance: {
          $in: ids,
        },
        ...(isStudent ? { user: ctx.meta.userSession.userAgents[0].id } : {}),
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
              type: 'assignation',
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
        from: 'v1::assignables_grades',
        localField: 'id',
        foreignField: 'assignation',
        as: 'grades',
        pipeline: [
          {
            $match: {
              type: 'main',
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        instance: 1,
        id: 1,
        user: 1,
        timestamps: '$dates',
        grades: {
          $map: {
            input: '$grades',
            as: 'grade',
            in: '$$grade.subject',
          },
        },
      },
    },
    {
      $group: {
        _id: '$instance',
        assignations: { $push: '$$ROOT' },
      },
    },
  ];
  const assignations = await ctx.tx.db.Assignations.aggregate(pipeline({ ids: instancesIds, ctx }));

  return keyBy(assignations, '_id', 'assignations');
}

module.exports = getAssignations;
