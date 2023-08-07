import { isString } from 'lodash';

async function savePackage(packageData) {
  const { file, ...body } = packageData;

  if (isString(file)) {
    body.file = file;
  } else if (file?.id) {
    body.file = file.id;
  }

  return leemons.api('scorm/package', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function getPackage(id) {
  return leemons.api(`scorm/package/${id}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function deletePackage(id) {
  return leemons.api(`scorm/package/${id}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

async function duplicatePackage(id, published) {
  return leemons.api(`scorm/package/duplicate`, {
    allAgents: true,
    method: 'POST',
    body: {
      id,
      published,
    },
  });
}

async function assignPackage(id, data) {
  return leemons.api(`scorm/package/assign`, {
    allAgents: true,
    method: 'POST',
    body: {
      id,
      data,
    },
  });
}

async function sharePackage(id, { canAccess }) {
  return leemons.api(`scorm/package/share`, {
    allAgents: true,
    method: 'POST',
    body: {
      assignableId: id,
      canAccess,
    },
  });
}

async function getSupportedVersions() {
  return leemons.api('scorm/package/supported-versions', {
    allAgents: true,
    method: 'GET',
  });
}

export {
  savePackage,
  getPackage,
  deletePackage,
  duplicatePackage,
  assignPackage,
  sharePackage,
  getSupportedVersions,
};
