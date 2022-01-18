async function reOrderCustomUserItems(key, parentKey, orderedIds) {
  return leemons.api(`menu-builder/menu/${key}/re-order`, {
    allAgents: true,
    method: 'POST',
    body: {
      parentKey,
      orderedIds,
    },
  });
}

export default reOrderCustomUserItems;
