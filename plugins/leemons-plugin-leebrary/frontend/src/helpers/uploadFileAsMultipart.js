/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */

import * as JSZip from 'jszip';
import * as _ from 'lodash';
import * as mime from 'mime-types';

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

async function sendChunk(dbfile, chunk, partNumber, path, retry = 0) {
  try {
    const formData = new FormData();
    formData.append(
      'body',
      JSON.stringify({
        fileId: dbfile.id,
        partNumber,
        path,
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
      return sendChunk(dbfile, chunk, partNumber, path, retry + 1);
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
    await sendChunk(dbfile, jsfile.slice(offset, offset + chunksSize), i + 1, jsfile.name);
    onProgress({
      totalChunks: nChunks,
      currentChunk: i,
      percentageCompleted: 100 - ((nChunks - (i + 1)) / nChunks) * 100,
      remainingChunks: nChunks - (i + 1),
    });
  }
}

async function createNewMultipartFileUpload(jsfile, { filePaths, pathsInfo, isFolder, name } = {}) {
  return leemons.api('leebrary/file/multipart/new', {
    allAgents: true,
    body: {
      name: name || jsfile.name,
      type: jsfile.type,
      size: jsfile.size,
      isFolder,
      filePaths,
      pathsInfo,
    },
    method: 'POST',
  });
}

async function finishMultipartFileUpload(dbfile, path) {
  return leemons.api('leebrary/file/multipart/finish', {
    allAgents: true,
    body: {
      fileId: dbfile.id,
      path,
    },
    method: 'POST',
  });
}

async function getZipFiles(jsfile) {
  const zip = new JSZip();
  await zip.loadAsync(jsfile);

  async function downloadEntry(entry) {
    const type = mime.lookup(entry.name.split('.').reverse()[0]);
    return new File([await zip.file(entry.name).async('blob')], entry.name, {
      type,
    });
  }

  const entries = [];
  zip.folder().forEach((relativePath, entry) => {
    if (!entry.dir) entries.push(entry);
  });

  return Promise.all(_.map(entries, downloadEntry));
}

async function uploadFileAsMultipart(jsfile, { onProgress = () => {}, name } = {}) {
  if (jsfile instanceof File) {
    const isFolder = jsfile.name?.endsWith('.zip');
    const filePaths = [];
    const pathsInfo = {};

    let filesToUpload = [jsfile];
    if (isFolder) {
      onProgress({
        state: 'unzip',
      });
      filesToUpload = await getZipFiles(jsfile);
      _.forEach(filesToUpload, (file) => {
        filePaths.push(file.name);
        pathsInfo[file.name] = {
          size: file.size,
        };
      });
    }

    onProgress({
      state: 'init',
    });
    const dbfile = await createNewMultipartFileUpload(jsfile, {
      filePaths,
      pathsInfo,
      isFolder,
      name,
    });
    const totalSize = _.sum(_.map(filesToUpload, 'size'));
    try {
      onProgress({
        state: 'uploading',
        totalSize,
        totalFiles: filesToUpload.length,
        percentageCompleted: 0,
        currentFile: 0,
      });
      let oldper = 0;
      for (let i = 0; i < filesToUpload.length; i++) {
        const currentFileSize = filesToUpload[i].size;
        await sendAllChunksInOrder(filesToUpload[i], dbfile, ({ percentageCompleted }) => {
          const filePercentageOnSize = (currentFileSize / totalSize) * 100;
          let totalPercentageSize = (percentageCompleted / 100) * filePercentageOnSize;

          if (percentageCompleted === 100) {
            oldper += totalPercentageSize;
            totalPercentageSize = 0;
          }

          onProgress({
            state: 'uploading',
            totalFiles: filesToUpload.length,
            totalSize,
            currentFileSize,
            currentFilePercentageCompleted: percentageCompleted.toFixed(2),
            percentageCompleted: oldper + totalPercentageSize,
            currentFile: i + 1,
          });
        });
        await finishMultipartFileUpload(dbfile, filesToUpload[i].name);
      }

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
