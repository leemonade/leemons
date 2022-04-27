import { isString } from 'lodash';

async function listQuestionsBanks(body) {
  return leemons.api(`tests/question-bank/list`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function saveQuestionBank(body) {
  const form = new FormData();
  if (!isString(body.cover)) {
    const { cover, ...data } = body;
    if (body.cover.id) {
      form.append('data', JSON.stringify({ ...data, cover: body.cover.file.id }));
    } else {
      form.append('cover', body.cover, body.cover.name);
      form.append('data', JSON.stringify(data));
    }
  } else {
    form.append('data', JSON.stringify(body));
  }

  return leemons.api('tests/question-bank', {
    allAgents: true,
    method: 'POST',
    headers: {
      'content-type': 'none',
    },
    body: form,
  });
}

async function getQuestionBank(id) {
  return leemons.api(`tests/question-bank/${id}`, {
    allAgents: true,
    method: 'GET',
  });
}

export { listQuestionsBanks, saveQuestionBank, getQuestionBank };
