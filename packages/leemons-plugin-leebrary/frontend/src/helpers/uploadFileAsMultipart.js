/* eslint-disable no-await-in-loop */
const chunksSize = 1024 * 1024 * 5; // 5mb
const maxRetry = 3;

async function abort(dbfile) {
  return leemons.api('leebrary/file/multipart/abort', {
    allAgents: true,
    body: {
      fileId: dbfile.id,
    },
    method: 'POST',
  });
}

async function sendChunk(dbfile, chunk, partNumber, retry = 0) {
  try {
    const formData = new FormData();
    formData.append(
      'body',
      JSON.stringify({
        fileId: dbfile.id,
        partNumber,
      })
    );
    formData.append('chunk', chunk, 'chunk');
    await leemons.api('leebrary/file/multipart/chunk', {
      allAgents: true,
      body: formData,
      headers: {
        'content-type': 'none',
      },
      method: 'POST',
    });
  } catch (e) {
    if (retry < maxRetry) {
      return sendChunk(dbfile, chunk, retry + 1);
    }
    throw e;
  }
  return null;
}

async function sendAllChunksInOrder(jsfile, dbfile, onProgress) {
  const nChunks = Math.ceil(jsfile.size / chunksSize, chunksSize);
  onProgress({
    totalChunks: nChunks,
    currentChunk: 0,
    percentageCompleted: 0,
    remainingChunks: nChunks,
  });
  for (let i = 0; i < nChunks; i++) {
    const offset = i * chunksSize;
    await sendChunk(dbfile, jsfile.slice(offset, offset + chunksSize), i + 1);
    onProgress({
      totalChunks: nChunks,
      currentChunk: i,
      percentageCompleted: 100 - ((nChunks - (i + 1)) / nChunks) * 100,
      remainingChunks: nChunks - (i + 1),
    });
  }
}

async function createNewMultipartFileUpload(jsfile, { name } = {}) {
  return leemons.api('leebrary/file/multipart/new', {
    allAgents: true,
    body: {
      name: name || jsfile.name,
      type: jsfile.type,
      size: jsfile.size,
    },
    method: 'POST',
  });
}

async function finishMultipartFileUpload(dbfile) {
  return leemons.api('leebrary/file/multipart/finish', {
    allAgents: true,
    body: {
      fileId: dbfile.id,
    },
    method: 'POST',
  });
}

async function uploadFileAsMultipart(jsfile, { onProgress = () => {}, name } = {}) {
  if (jsfile instanceof File) {
    const dbfile = await createNewMultipartFileUpload(jsfile, { name });
    try {
      await sendAllChunksInOrder(jsfile, dbfile, onProgress);
      await finishMultipartFileUpload(dbfile);
      return dbfile.id;
    } catch (e) {
      await abort(dbfile);
      throw e;
    }
  }
  return jsfile;
}

export { uploadFileAsMultipart };
export default uploadFileAsMultipart;
