import type { Model } from "@leemons/mongodb";

export type MongoDBPaginateAggregationPipelineParams = {
  page: number;
  size: number;
  path?: string;
};

export function mongoDBPaginateAggregationPipeline({
  page: _page,
  size: _size,
  path = "$$ROOT",
}: MongoDBPaginateAggregationPipelineParams): Parameters<
  Model<unknown>["aggregate"]
>[0] {
  const page = Math.max(0, _page);
  const size = Math.max(1, _size);
  const offset = page * size;

  return [
    {
      $group: {
        _id: null,
        items: { $push: path },
        totalCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        items: { $slice: ["$items", offset, size] },
        page: { $literal: page },
        size: { $literal: size },
        totalPages: { $ceil: { $divide: ["$totalCount", size] } },
        totalCount: 1,
      },
    },
    {
      $addFields: {
        count: { $size: "$items" },
        nextPage: {
          $cond: [
            { $lt: [{ $add: [offset, size] }, "$totalCount"] },
            { $add: [page, 1] },
            null,
          ],
        },
        prevPage: {
          $cond: [{ $gt: [page, 0] }, { $subtract: [page, 1] }, null],
        },
        canGoPrevPage: { $gt: [page, 0] },
        canGoNextPage: { $lt: [{ $add: [offset, size] }, "$totalCount"] },
      },
    },
  ];
}
