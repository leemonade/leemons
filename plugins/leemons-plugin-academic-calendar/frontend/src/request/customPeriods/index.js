async function getCustomPeriodByItem(item) {
  return leemons.api(`v1/academic-calendar/custom-period/item/${item}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function setItemCustomPeriod(payload) {
  return leemons.api(`v1/academic-calendar/custom-period/item`, {
    allAgents: true,
    method: 'POST',
    body: payload,
  });
}

async function assignToItems(payload) {
  return leemons.api(`v1/academic-calendar/custom-period/item/assign-to-many`, {
    allAgents: true,
    method: 'POST',
    body: payload,
  });
}

export { getCustomPeriodByItem, setItemCustomPeriod, assignToItems };
