import { cloneDeep, merge } from 'lodash';

async function listTests({ page, size, published }) {
  return leemons.api(`v1/tests/tests?page=${page}&size=${size}&published=${published}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function saveTest(_body) {
  const body = cloneDeep(_body);
  let form = {};
  form = merge(body, form);

  return leemons.api('v1/tests/tests', {
    allAgents: true,
    method: 'POST',
    body: form,
  });
}

async function getTest(id, { withQuestionBank } = { withQuestionBank: false }) {
  return leemons.api(`v1/tests/tests/${id}?withQuestionBank=${withQuestionBank}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function setInstanceTimestamp(instance, timeKey, user) {
  return leemons.api(`v1/tests/tests/instance/timestamp`, {
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
  return leemons.api(`v1/tests/tests/instance/question/response`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function getUserQuestionResponses(instance, user) {
  let url = `v1/tests/tests/instance/${instance}/question/response`;
  if (user) {
    url += `?user=${user}`;
  }
  return leemons.api(url, {
    allAgents: true,
    method: 'GET',
  });
}

async function deleteTest(id) {
  return leemons.api(`v1/tests/tests/${id}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

async function assignTest(id, data) {
  return leemons.api(`v1/tests/tests/assign`, {
    allAgents: true,
    method: 'POST',
    body: {
      id,
      data,
    },
  });
}

async function createAssignedConfigs(name, config) {
  const response = await leemons.api(`v1/tests/tests/assign/configs`, {
    allAgents: true,
    method: 'POST',
    body: {
      name,
      config,
    },
  });
  return response.id;
}

async function getAssignConfigs() {
  return leemons.api(`v1/tests/tests/assign/configs`, {
    allAgents: true,
    method: 'GET',
  });
}

async function deleteAssignedConfig(id) {
  return leemons.api(`v1/tests/tests/assign/configs/${id}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

async function updateAssignedConfig(id, name, config) {
  return leemons.api(`v1/tests/tests/assign/configs/${id}`, {
    allAgents: true,
    method: 'PUT',
    body: {
      name,
      config,
    },
  });
}

async function getFeedback(instance, user) {
  return leemons.api(`v1/tests/tests/instance/${instance}/feedback/${user}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function setFeedback(instance, user, feedback) {
  return leemons.api(`v1/tests/tests/instance/feedback`, {
    allAgents: true,
    method: 'POST',
    body: {
      id: instance,
      user,
      feedback,
    },
  });
}

async function duplicate({
  id,
  published = false,
  ignoreSubjects = false,
  keepQuestionBank = true,
}) {
  const body = {
    id,
    published,
    ignoreSubjects,
    keepQuestionBank,
  };

  return leemons.api(`v1/tests/tests/duplicate`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function setOpenQuestionGrade(data) {
  return leemons.api(`v1/tests/tests/instance/question/grade`, {
    allAgents: true,
    method: 'POST',
    body: data,
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
  createAssignedConfigs,
  getAssignConfigs,
  deleteAssignedConfig,
  updateAssignedConfig,
  setInstanceTimestamp,
  getUserQuestionResponses,
  setQuestionResponse,
  setOpenQuestionGrade,
};
