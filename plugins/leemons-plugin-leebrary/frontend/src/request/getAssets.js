import { keys } from 'lodash';

async function getAssets({ pinned, showPublic, ...filters } = {}) {
  let params = keys(filters)
    .filter((key) => Boolean(filters[key]))
    .map((key) => `${key}=${filters[key]}`);

  if (pinned) {
    params.push('showPublic=true');
  } else {
    params.push(`showPublic=${showPublic}`);
  }

  params = params.join('&');

  let url = `v1/leebrary/assets/list?${params}`;

  if (pinned) {
    url = `v1/leebrary/assets/pins?${params}`;
  }

  return leemons.api(url, {
    allAgents: true,
    method: 'GET',
  });
}

export default getAssets;
