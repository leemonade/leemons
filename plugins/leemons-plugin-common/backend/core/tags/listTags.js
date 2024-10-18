const {
  mongoDBPaginateAggregationPipeline,
  EMPTY_PAGINATED_RESULT,
} = require('@leemons/mongodb-helpers');
const _ = require('lodash');

async function listTags({ page, size, query = {}, ctx }) {
  const pipeline = [
    {
      $match: { ...query, deploymentID: ctx.meta.deploymentID },
    },
    {
      $sort: {
        tag: 1,
      },
    },
    {
      $group: {
        _id: '$tag',
      },
    },
    {
      $group: {
        _id: null,
        tags: { $push: '$_id' },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    ...mongoDBPaginateAggregationPipeline({ page, size, path: '$tags' }),
  ];

  const results = await ctx.tx.db.Tags.aggregate(pipeline);

  if (!results?.length) {
    return EMPTY_PAGINATED_RESULT;
  }

  const response = results[0];
  response.items = response.items[0];
  return response;
}

module.exports = { listTags };
