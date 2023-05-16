import { keys } from 'lodash';

async function getAssets({ pinned, showPublic, ...filters } = {}) {
  let params = keys(filters).map((key) => `${key}=${filters[key]}`);

  if (pinned) {
    params.push('showPublic=true');
  } else {
    params.push(`showPublic=${showPublic}`);
  }

  params = params.join('&');

  let url = `leebrary/assets/list?${params}`;

  if (pinned) {
    url = `leebrary/assets/pins?${params}`;
  }

  return leemons.api(url, {
    allAgents: true,
    method: 'GET',
  });
}

export default getAssets;
