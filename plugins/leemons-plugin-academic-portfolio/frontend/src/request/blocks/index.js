async function listBlocksBySubjectRequest({ subjectId, page, size }) {
  return leemons.api(
    `v1/academic-portfolio/block/by-subject/${subjectId}?page=${page}&size=${size}`,
    {
      method: 'GET',
    }
  );
}

async function createBlockRequest(body) {
  return leemons.api('v1/academic-portfolio/block', {
    method: 'POST',
    body,
  });
}

async function updateBlockRequest(body) {
  return leemons.api('v1/academic-portfolio/block', {
    method: 'PUT',
    body,
  });
}

async function removeBlockRequest(id) {
  return leemons.api(`v1/academic-portfolio/block/${id}`, {
    method: 'DELETE',
  });
}

export { listBlocksBySubjectRequest, createBlockRequest, updateBlockRequest, removeBlockRequest };
