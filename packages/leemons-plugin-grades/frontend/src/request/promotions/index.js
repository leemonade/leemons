const pluginPath = 'grades';

async function listPromotions({ page, size, center }) {
  return leemons.api(`${pluginPath}/rules?page=${page}&size=${size}&center=${center}`, {
    allAgents: true,
  });
}

async function addPromotion(body) {
  return leemons.api(`${pluginPath}/rules`, {
    method: 'POST',
    body,
    allAgents: true,
  });
}

async function updatePromotion(body) {
  return leemons.api(`${pluginPath}/rules`, {
    method: 'PUT',
    body,
    allAgents: true,
  });
}

async function deletePromotion(id) {
  return leemons.api(`${pluginPath}/rules/${id}`, {
    method: 'DELETE',
    allAgents: true,
  });
}

export { listPromotions, deletePromotion, addPromotion, updatePromotion };
