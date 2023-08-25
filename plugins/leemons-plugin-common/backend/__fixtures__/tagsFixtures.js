module.exports = function tagsFixtures() {
  return {
    initialData: {
      tags: ['test-tag', 'confirmation-tag'],
      type: 'leemons-test.my-type',
      values: ['value1', 'value2'],
    },
    tagsObjectFiltered: [
      { tag: 'test-tag', value: '"value1"', type: 'leemons-test.my-type' },
      { tag: 'test-tag', value: '"value2"', type: 'leemons-test.my-type' },
      { tag: 'confirmation-tag', value: '"value1"', type: 'leemons-test.my-type' },
      { tag: 'confirmation-tag', value: '"value2"', type: 'leemons-test.my-type' },
    ],
    listTagsArguments: {
      page: 0,
      size: 3,
      query: { type: 'leemons-test.my-type' },
    },
    mongoDBPaginateReturnValue: {
      items: [
        { tag: 'test-tag', dbExtraProperty: '123' },
        { tag: 'test-tag', dbExtraProperty: '123' },
        { tag: 'confirmation-tag', dbExtraProperty: '123' },
      ],
      count: 3,
      totalCount: 4,
      totalPages: 2,
      page: 0,
      size: 3,
      nextPage: 1,
      prevPage: 0,
      canGoPrevPage: false,
      canGoNextPage: true,
    },
    mongoDBPaginateEmptyReturnValue: {
      items: [],
      count: 0,
      totalCount: 0,
      totalPages: 0,
      page: 0,
      size: 3,
      nextPage: 0,
      prevPage: 0,
      canGoPrevPage: false,
      canGoNextPage: false,
    },
  };
};
