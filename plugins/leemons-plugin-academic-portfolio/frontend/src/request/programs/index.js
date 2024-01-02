import uploadFileAsMultipart from '@leebrary/helpers/uploadFileAsMultipart';
import { cloneDeep, isString } from 'lodash';

async function getProgramTree(programId) {
  return leemons.api(`v1/academic-portfolio/programs/${programId}/tree`, {
    allAgents: true,
    method: 'GET',
  });
}

async function listPrograms({ page, size, center }) {
  return leemons.api(`v1/academic-portfolio/programs?page=${page}&size=${size}&center=${center}`, {
    waitToFinish: true,
    allAgents: true,
    method: 'GET',
  });
}

async function havePrograms() {
  return leemons.api(`v1/academic-portfolio/programs/have`, {
    allAgents: true,
    method: 'GET',
  });
}

async function detailProgram(id, withClasses = false) {
  return leemons.api(`v1/academic-portfolio/programs/${id}?withClasses=${withClasses}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function getUserPrograms() {
  return leemons.api(`v1/academic-portfolio/programs/user`, {
    allAgents: true,
    method: 'GET',
  });
}

async function createProgram(_body) {
  const body = cloneDeep(_body);
  if (body.image && !isString(body.image)) {
    if (body.image) {
      if (body.image.id) {
        body.image = body.image.cover?.id;
      } else {
        body.image = await uploadFileAsMultipart(body.image, { name: body.image.name });
      }
    }
  }
  return leemons.api('v1/academic-portfolio/programs', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function updateProgram(_body) {
  const body = cloneDeep(_body);
  if (body.image && !isString(body.image)) {
    const { image, ...data } = body;
    if (body.image) {
      if (body.image.id) {
        body.image = body.image.cover?.id;
      } else {
        console.log('BODY', body);
        console.log('BODY', body.image.name);
        body.image = await uploadFileAsMultipart(body.image, { name: body.image.name });
      }
    }
  }
  return leemons.api('v1/academic-portfolio/programs', {
    allAgents: true,
    method: 'PUT',
    body,
  });
}

async function addStudentsToClassesUnderNodeTree(body) {
  return leemons.api('v1/academic-portfolio/programs/add-students-to-classes-under-node-tree', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function getProgramEvaluationSystem(id) {
  return leemons.api(`v1/academic-portfolio/programs/${id}/evaluation-system`, {
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
