async function reOrderCustomUserItems(key, parentKey, orderedIds) {
  return leemons.api(
    {
      url: 'menu-builder/menu/:key/re-order',
      query: {
        key,
      },
    },
    {
      method: 'POST',
      body: {
        parentKey,
        orderedIds,
      },
    }
  );
}

export default reOrderCustomUserItems;
