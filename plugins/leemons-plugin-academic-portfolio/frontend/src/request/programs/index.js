import uploadFileAsMultipart from '@leebrary/helpers/uploadFileAsMultipart';
import { cloneDeep, isBoolean, isString } from 'lodash';

async function getProgramTree(programId) {
  return leemons.api(`v1/academic-portfolio/programs/${programId}/tree`, {
    allAgents: true,
    method: 'GET',
  });
}

async function listPrograms({ page, size, center, onlyArchived }) {
  const queryParams = new URLSearchParams({
    page,
    size,
    center,
  });

  if (onlyArchived) {
    queryParams.append('archived', '');
  }

  return leemons.api(`v1/academic-portfolio/programs?${queryParams.toString()}`, {
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

async function detailProgram(id, withClasses, showArchived, withStudentsAndTeachers) {
  const queryParams = new URLSearchParams();
  if (typeof withClasses === 'boolean') {
    queryParams.append('withClasses', withClasses);
  }
  if (typeof showArchived === 'boolean') {
    queryParams.append('showArchived', showArchived);
  }
  if (typeof withStudentsAndTeachers === 'boolean') {
    queryParams.append('withStudentsAndTeachers', withStudentsAndTeachers);
  }

  return leemons.api(`v1/academic-portfolio/programs/${id}?${queryParams.toString()}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function getProgramsPublicInfo(programsIds) {
  return leemons.api(`v1/academic-portfolio/programs/publicInfo`, {
    allAgents: true,
    method: 'POST',
    body: { ids: JSON.stringify(programsIds) },
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
    if (body.image.id) {
      body.image = body.image.cover?.id;
    } else {
      body.image = await uploadFileAsMultipart(body.image, { name: body.image.name });
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

async function updateProgramConfiguration(_body) {
  const body = cloneDeep(_body);
  if (body.image && !isString(body.image)) {
    if (body.image.id) {
      body.image = body.image.cover?.id;
    } else {
      body.image = await uploadFileAsMultipart(body.image, { name: body.image.name });
    }
  }

  return leemons.api('v1/academic-portfolio/programs/config', {
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

async function removeProgram({ id, soft }) {
  const queryParams = new URLSearchParams();
  if (typeof soft !== 'undefined') {
    queryParams.append('soft', soft);
  } else {
    queryParams.append('soft', false);
  }
  return leemons.api(`v1/academic-portfolio/programs/${id}?${queryParams.toString()}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

async function programHasSubjectHistory({ programId }) {
  return leemons.api(`v1/academic-portfolio/programs/${programId}/has-subject-history`, {
    allAgents: true,
    method: 'GET',
  });
}

async function duplicateProgram({ programId }) {
  return leemons.api(`v1/academic-portfolio/programs/${programId}/duplicate`, {
    allAgents: true,
    method: 'POST',
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
  getProgramsPublicInfo,
  removeProgram,
  updateProgramConfiguration,
  programHasSubjectHistory,
  duplicateProgram,
};
