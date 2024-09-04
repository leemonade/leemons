/**
 * @param {object} params
 * @param {number} params.page
 * @param {number} params.size
 * @returns {object[]}
 */
module.exports = function mongoDBPaginateAggregationPipeline({ page: _page, size: _size }) {
  const page = Math.max(1, _page);
  const size = Math.max(1, _size);
  const offset = page * size;

  return [
    {
      $group: {
        _id: null,
        items: { $push: '$$ROOT' },
        totalCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        items: { $slice: ['$items', offset, size] },
        page: { $literal: page },
        size: { $literal: size },
        totalPages: { $ceil: { $divide: ['$totalCount', size] } },
        totalCount: 1,
      },
    },
    {
      $addFields: {
        count: { $size: '$items' },
        nextPage: {
          $cond: [{ $lt: [{ $add: [offset, size] }, '$totalCount'] }, { $add: [page, 1] }, null],
        },
        prevPage: {
          $cond: [{ $gt: [page, 0] }, { $subtract: [page, 1] }, null],
        },
        canGoPrevPage: { $gt: [page, 1] },
        canGoNextPage: { $lt: [{ $add: [offset, size] }, '$totalCount'] },
      },
    },
  ];
};
