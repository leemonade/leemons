import { isString } from 'lodash';

async function listTests({ page, size, published }) {
  return leemons.api(`tests/tests?page=${page}&size=${size}&published=${published}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function saveTest(body) {
  const form = new FormData();
  if (body.cover && !isString(body.cover)) {
    const { cover, ...data } = body;
    if (body.cover) {
      if (body.cover.id) {
        data.cover = body.cover.cover?.id;
      } else {
        form.append('cover', body.cover, body.cover.name);
      }
    }
    form.append('data', JSON.stringify(data));
  } else {
    form.append('data', JSON.stringify(body));
  }
  return leemons.api('tests/tests', {
    allAgents: true,
    method: 'POST',
    headers: {
      'content-type': 'none',
    },
    body: form,
  });
}

async function getTest(id, { withQuestionBank } = { withQuestionBank: false }) {
  return leemons.api(`tests/tests/${id}?withQuestionBank=${withQuestionBank}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function setInstanceTimestamp(instance, timeKey, user) {
  return leemons.api(`tests/tests/instance/timestamp`, {
    allAgents: true,
    method: 'POST',
    body: {
      instance,
      timeKey,
      user,
    },
  });
}

async function setQuestionResponse(body) {
  return leemons.api(`tests/tests/instance/question/response`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function getUserQuestionResponses(instance, user) {
  let url = `tests/tests/instance/${instance}/question/response`;
  if (user) {
    url += `?user=${user}`;
  }
  return leemons.api(url, {
    allAgents: true,
    method: 'GET',
  });
}

async function deleteTest(id) {
  return leemons.api(`tests/tests/${id}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

export {
  listTests,
  saveTest,
  getTest,
  deleteTest,
  setInstanceTimestamp,
  getUserQuestionResponses,
  setQuestionResponse,
};
