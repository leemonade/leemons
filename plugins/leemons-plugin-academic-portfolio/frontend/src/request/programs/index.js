import { isString } from 'lodash';

async function getProgramTree(programId) {
  return leemons.api(`academic-portfolio/program/${programId}/tree`, {
    allAgents: true,
    method: 'GET',
  });
}

async function listPrograms({ page, size, center }) {
  return leemons.api(`academic-portfolio/program?page=${page}&size=${size}&center=${center}`, {
    waitToFinish: true,
    allAgents: true,
    method: 'GET',
  });
}

async function havePrograms() {
  return leemons.api(`academic-portfolio/program/have`, {
    allAgents: true,
    method: 'GET',
  });
}

async function detailProgram(id) {
  return leemons.api(`academic-portfolio/program/${id}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function getUserPrograms() {
  return leemons.api(`academic-portfolio/user/programs`, {
    allAgents: true,
    method: 'GET',
  });
}

async function createProgram(body) {
  const form = new FormData();
  if (body.image && !isString(body.image)) {
    const { image, icon, ...data } = body;
    if (body.image) {
      if (body.image.id) {
        data.image = body.image.cover?.id;
      } else {
        form.append('image', body.image, body.image.name);
      }
    }
    form.append('data', JSON.stringify(data));
  } else {
    form.append('data', JSON.stringify(body));
  }
  return leemons.api('academic-portfolio/program', {
    allAgents: true,
    method: 'POST',
    headers: {
      'content-type': 'none',
    },
    body: form,
  });
}

async function updateProgram(body) {
  const form = new FormData();
  if (body.image && !isString(body.image)) {
    const { image, ...data } = body;
    if (body.image) {
      if (body.image.id) {
        data.image = body.image.cover?.id;
      } else {
        form.append('image', body.image, body.image.name);
      }
    }
    form.append('data', JSON.stringify(data));
  } else {
    form.append('data', JSON.stringify(body));
  }
  return leemons.api('academic-portfolio/program', {
    allAgents: true,
    method: 'PUT',
    headers: {
      'content-type': 'none',
    },
    body: form,
  });
}

async function addStudentsToClassesUnderNodeTree(body) {
  return leemons.api('academic-portfolio/program/add-students-to-classes-under-node-tree', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function getProgramEvaluationSystem(id) {
  return leemons.api(`academic-portfolio/program/${id}/evaluation-system`, {
    allAgents: true,
    method: 'GET',
  });
}

export {
  listPrograms,
  detailProgram,
  createProgram,
  updateProgram,
  havePrograms,
  getProgramTree,
  getUserPrograms,
  getProgramEvaluationSystem,
  addStudentsToClassesUnderNodeTree,
};
