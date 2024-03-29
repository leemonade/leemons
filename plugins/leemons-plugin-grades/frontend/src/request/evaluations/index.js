const pluginPath = 'grades';

async function listGrades({ page, size, center }) {
  return leemons.api(`v1/${pluginPath}/grades?page=${page}&size=${size}&center=${center}`, {
    allAgents: true,
  });
}

async function haveGrades() {
  return leemons.api(`v1/${pluginPath}/grades/have`, {
    allAgents: true,
  });
}

async function addGrade(body) {
  return leemons.api(`v1/${pluginPath}/grades`, {
    method: 'POST',
    body,
    allAgents: true,
  });
}

async function updateGrade(body) {
  return leemons.api(`v1/${pluginPath}/grades`, {
    method: 'PUT',
    body,
    allAgents: true,
  });
}

async function getGrade(id) {
  return leemons.api(`v1/${pluginPath}/grades/${id}`, {
    method: 'GET',
    allAgents: true,
  });
}

async function deleteGrade(id) {
  return leemons.api(`v1/${pluginPath}/grades/${id}`, {
    method: 'DELETE',
    allAgents: true,
  });
}

async function addGradeTag(body) {
  return leemons.api(`v1/${pluginPath}/gradeTags`, {
    method: 'POST',
    body,
    allAgents: true,
  });
}

async function updateGradeTag(body) {
  return leemons.api(`v1/${pluginPath}/gradeTags`, {
    method: 'PUT',
    body,
    allAgents: true,
  });
}

async function deleteGradeTag(id) {
  return leemons.api(`v1/${pluginPath}/gradeTags/${id}`, {
    method: 'DELETE',
    allAgents: true,
  });
}

async function addGradeScale(body) {
  return leemons.api(`v1/${pluginPath}/gradeScales`, {
    method: 'POST',
    body,
    allAgents: true,
  });
}

async function updateGradeScale(body) {
  return leemons.api(`v1/${pluginPath}/gradeScales`, {
    method: 'PUT',
    body,
    allAgents: true,
  });
}

async function deleteGradeScale(id) {
  return leemons.api(`v1/${pluginPath}/gradeScales/${id}`, {
    method: 'DELETE',
    allAgents: true,
  });
}

async function canDeleteGradeScale(id) {
  return leemons.api(`v1/${pluginPath}/gradeScales/${id}`, {
    method: 'DELETE',
    allAgents: true,
  });
}

export {
  getGrade,
  addGrade,
  haveGrades,
  listGrades,
  deleteGrade,
  updateGrade,
  addGradeTag,
  updateGradeTag,
  deleteGradeTag,
  addGradeScale,
  updateGradeScale,
  deleteGradeScale,
  canDeleteGradeScale,
};
