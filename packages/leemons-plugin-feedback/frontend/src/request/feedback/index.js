import { cloneDeep, isString } from 'lodash';

async function listFeedback({ page, size, published }) {
  return leemons.api(`feedback/feedback?page=${page}&size=${size}&published=${published}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function saveFeedback(_body) {
  const body = cloneDeep(_body);
  const form = new FormData();
  if (_body.cover && !isString(_body.cover)) {
    const { cover, ...data } = body;
    if (_body.cover) {
      if (_body.cover.id) {
        data.cover = _body.cover.cover?.id;
      } else {
        form.append('cover', _body.cover, _body.cover.name);
      }
    }
    form.append('data', JSON.stringify(data));
  } else {
    form.append('data', JSON.stringify(body));
  }
  return leemons.api('feedback/feedback', {
    allAgents: true,
    method: 'POST',
    headers: {
      'content-type': 'none',
    },
    body: form,
  });
}

async function getFeedback(id) {
  return leemons.api(`feedback/feedback/${id}`, {
    allAgents: true,
    method: 'GET',
  });
}

export { listFeedback, saveFeedback, getFeedback };
