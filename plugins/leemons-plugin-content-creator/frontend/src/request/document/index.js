import uploadFileAsMultipart from '@leebrary/helpers/uploadFileAsMultipart';

const { cloneDeep, isString } = require('lodash');

async function saveDocument(_body) {
  const body = cloneDeep(_body);
  const form = {};

  if (
    (_body.featuredImage && !isString(_body.featuredImage)) ||
    (_body.cover && !isString(_body.cover))
  ) {
    const { cover, featuredImage, ...data } = body;
    if (_body.cover) {
      if (_body.cover.cover) {
        data.cover = _body.cover.cover?.id;
      } else if (_body.cover.id) {
        data.cover = _body.cover.id;
      } else {
        data.cover = await uploadFileAsMultipart(_body.cover, { name: _body.cover.name });
      }
    }
    if (_body.featuredImage) {
      if (_body.featuredImage.cover) {
        data.featuredImage = _body.featuredImage.cover?.id;
      } else if (_body.featuredImage.id) {
        data.featuredImage = _body.featuredImage.id;
      } else {
        data.featuredImage = await uploadFileAsMultipart(_body.featuredImage, {
          name: _body.featuredImage.name,
        });
      }
    }
    form.data = JSON.stringify(data);
  } else {
    form.data = JSON.stringify(body);
  }

  return leemons.api('v1/content-creator/document', {
    allAgents: true,
    method: 'POST',
    body: form,
  });
}

async function getDocument(id) {
  return leemons.api(`v1/content-creator/document/${id}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function deleteDocument(id) {
  return leemons.api(`v1/content-creator/document/${id}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

async function duplicateDocument(id, published) {
  return leemons.api(`v1/content-creator/document/duplicate`, {
    allAgents: true,
    method: 'POST',
    body: {
      id,
      published,
    },
  });
}

async function assignDocument(id, data) {
  return leemons.api(`v1/content-creator/document/assign`, {
    allAgents: true,
    method: 'POST',
    body: {
      id,
      data,
    },
  });
}

async function shareDocument(id, { canAccess }) {
  return leemons.api(`v1/content-creator/document/share`, {
    allAgents: true,
    method: 'POST',
    body: {
      assignableId: id,
      canAccess,
    },
  });
}

export {
  saveDocument,
  getDocument,
  deleteDocument,
  duplicateDocument,
  assignDocument,
  shareDocument,
};
