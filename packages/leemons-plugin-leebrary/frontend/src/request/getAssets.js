import { keys } from 'lodash';

async function getAssets(filters = {}) {
  const params = keys(filters)
    .map((key) => `${key}=${filters[key]}`)
    .join('&');

  return leemons.api(`leebrary/assets/list?${params}`, {
    allAgents: true,
    method: 'GET',
  });
}

export default getAssets;
