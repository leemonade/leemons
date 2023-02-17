import isString from 'lodash/isString';

async function save(body) {
  const form = new FormData();
  if (body.asset && !isString(body.asset)) {
    const { asset, ...data } = body;
    if (body.asset) {
      if (body.asset.id) {
        data.asset = body.asset.cover?.id;
      } else {
        form.append('asset', body.asset, body.asset.name);
      }
    }
    form.append('data', JSON.stringify(data));
  } else {
    form.append('data', JSON.stringify(body));
  }
  return leemons.api(`board-messages/save`, {
    allAgents: true,
    method: 'POST',
    headers: {
      'content-type': 'none',
    },
    body: form,
  });
}

export default save;
