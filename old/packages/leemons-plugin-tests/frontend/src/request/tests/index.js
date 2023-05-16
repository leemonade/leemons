import { cloneDeep, isString } from 'lodash';

async function listTests({ page, size, published }) {
  return leemons.api(`tests/tests?page=${page}&size=${size}&published=${published}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function saveTest(_body) {
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

async function assignTest(id, data) {
  return leemons.api(`tests/tests/assign`, {
    allAgents: true,
    method: 'POST',
    body: {
      id,
      data,
    },
  });
}

async function getAssignConfigs() {
  return leemons.api(`tests/tests/assign/configs`, {
    allAgents: true,
    method: 'GET',
  });
}

async function getFeedback(instance, user) {
  return leemons.api(`tests/tests/instance/${instance}/feedback/${user}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function setFeedback(instance, user, feedback) {
  return leemons.api(`tests/tests/instance/feedback`, {
    allAgents: true,
    method: 'POST',
    body: {
      id: instance,
      user,
      feedback,
    },
  });
}

async function duplicate(instance, published = false) {
  return leemons.api(`tests/tests/duplicate`, {
    allAgents: true,
    method: 'POST',
    body: {
      id: instance,
      published,
    },
  });
}

export {
  listTests,
  saveTest,
  getTest,
  deleteTest,
  assignTest,
  duplicate,
  getFeedback,
  setFeedback,
  getAssignConfigs,
  setInstanceTimestamp,
  getUserQuestionResponses,
  setQuestionResponse,
};
