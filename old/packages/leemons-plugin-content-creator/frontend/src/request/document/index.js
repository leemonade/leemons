const { cloneDeep, isString } = require('lodash');

async function saveDocument(_body) {
  const body = cloneDeep(_body);
  const form = new FormData();

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
        form.append('cover', _body.cover, _body.cover.name);
      }
    }
    if (_body.featuredImage) {
      if (_body.featuredImage.cover) {
        data.featuredImage = _body.featuredImage.cover?.id;
      } else if (_body.featuredImage.id) {
        data.featuredImage = _body.featuredImage.id;
      } else {
        form.append('featuredImage', _body.featuredImage, _body.featuredImage.name);
      }
    }
    form.append('data', JSON.stringify(data));
  } else {
    form.append('data', JSON.stringify(body));
  }

  return leemons.api('content-creator/document', {
    allAgents: true,
    method: 'POST',
    headers: {
      'content-type': 'none',
    },
    body: form,
  });
}

async function getDocument(id) {
  return leemons.api(`content-creator/document/${id}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function deleteDocument(id) {
  return leemons.api(`content-creator/document/${id}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

async function duplicateDocument(id, published) {
  return leemons.api(`content-creator/document/duplicate`, {
    allAgents: true,
    method: 'POST',
    body: {
      id,
      published,
    },
  });
}

async function assignDocument(id, data) {
  return leemons.api(`content-creator/document/assign`, {
    allAgents: true,
    method: 'POST',
    body: {
      id,
      data,
    },
  });
}

async function shareDocument(id, { canAccess }) {
  return leemons.api(`content-creator/document/share`, {
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
