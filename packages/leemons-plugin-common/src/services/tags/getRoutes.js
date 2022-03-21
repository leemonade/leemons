function getRoutes(handlerFileName, aditionalOptions = {}) {
  return [
    {
      path: '/tags/list',
      method: 'POST',
      handler: `${handlerFileName}.listTags`,
      ...aditionalOptions,
    },
  ];
}

module.exports = { getRoutes };
