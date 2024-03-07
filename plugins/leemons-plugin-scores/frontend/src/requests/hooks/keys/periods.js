export const allPeriodsKey = [
  {
    plugin: 'plugin.scores',
    scope: 'periods',
  },
];

export const allPaginatedPeriodsListsKey = [
  {
    ...allPeriodsKey[0],
    action: 'paginate',
    entity: 'list',
  },
];

export const paginatePeriodsListKey = ({ page, size, query, sort, userAgents }) => [
  {
    ...allPaginatedPeriodsListsKey[0],

    page,
    size,
    query,
    sort,
    userAgents,
  },
];
