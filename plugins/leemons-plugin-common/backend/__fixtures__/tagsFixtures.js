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
  };
};
