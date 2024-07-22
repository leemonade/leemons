/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */

import * as JSZip from 'jszip';
import * as _ from 'lodash';
import * as mime from 'mime-types';

const chunksSize = 1024 * 1024 * 5; // 5mb
const maxRetry = 3;

async function abort(dbfile) {
  return leemons.api('v1/leebrary/file/multipart/abort', {
    allAgents: true,
    body: {
      fileId: dbfile.id,
    },
    method: 'POST',
  });
}

async function sendChunk(dbfile, chunk, partNumber, path, uploadUrl, onProgress, retry = 0) {
  try {
    if (uploadUrl) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (data) => {
          const progress = Math.round((data.loaded * 100) / data.total);
          onProgress(progress);
        });

        xhr.open('PUT', uploadUrl);

        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4 && xhr.status === 200) {
            // retrieving the ETag parameter from the HTTP headers
            const ETag = xhr.getResponseHeader('ETag');

            if (ETag) {
              resolve(JSON.parse(ETag));
            }
          }
        };

        xhr.onerror = (error) => {
          reject(error);
        };

        xhr.onabort = () => {
          reject(new Error('Upload canceled by user'));
        };

        xhr.send(chunk);
      });
    }
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
    await leemons.api('v1/leebrary/file/multipart/chunk', {
      allAgents: true,
      body: formData,
      headers: {
        'content-type': 'none',
      },
      method: 'POST',
    });
  } catch (e) {
    console.error('error', e);
    if (retry < maxRetry) {
      return sendChunk(dbfile, chunk, partNumber, path, uploadUrl, onProgress, retry + 1);
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

  const { urls } = await leemons.api('v1/leebrary/file/multipart/chunk/urls', {
    allAgents: true,
    body: {
      fileId: dbfile.id,
      nChunks,
      path: jsfile.name,
    },
    method: 'POST',
  });

  const etags = [];

  for (let i = 0; i < nChunks; i++) {
    const offset = i * chunksSize;
    const etag = await sendChunk(
      dbfile,
      jsfile.slice(offset, offset + chunksSize),
      i + 1,
      jsfile.name,
      urls?.length ? urls[i] : null,
      (progress) => {
        onProgress({
          totalChunks: nChunks,
          currentChunk: i,
          percentageCompleted: 100 - ((nChunks - (i + 1)) / nChunks) * 100,
          remainingChunks: nChunks - i,
        });
      }
    );
    etags.push(etag);
    onProgress({
      totalChunks: nChunks,
      currentChunk: i,
      percentageCompleted: 100 - ((nChunks - (i + 1)) / nChunks) * 100,
      remainingChunks: nChunks - (i + 1),
    });
  }

  return etags;
}

async function createNewMultipartFileUpload(
  jsfile,
  { filePaths, pathsInfo, isFolder, name, copyright, externalUrl } = {}
) {
  const body = {
    name: name || jsfile.name,
    type: jsfile.type,
    size: jsfile.size,
    isFolder,
    filePaths,
    pathsInfo,
  };
  if (copyright && !_.isEmpty(copyright)) {
    body.copyright = JSON.stringify(copyright);
  }
  if (externalUrl) {
    body.externalUrl = externalUrl;
  }
  return leemons.api('v1/leebrary/file/multipart/new', {
    allAgents: true,
    body,
    method: 'POST',
  });
}

async function finishMultipartFileUpload(dbfile, path, etags) {
  return leemons.api('v1/leebrary/file/multipart/finish', {
    allAgents: true,
    body: {
      fileId: dbfile.id,
      path,
      etags,
    },
    method: 'POST',
  });
}

async function getZipFiles(jsfile) {
  const zip = new JSZip();

  // Check if the file is a valid zip file
  if (jsfile.type !== 'application/zip') {
    throw new Error('Invalid file type. Only zip files are allowed.');
  }

  // Check if the file size is within acceptable limits (e.g., 200MB)
  const maxFileSize = 200 * 1024 * 1024; // 200MB
  if (jsfile.size > maxFileSize) {
    throw new Error('File size exceeds the maximum limit of 200MB.');
  }

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

async function uploadFileAsMultipart(
  jsfile,
  { onProgress = () => {}, name, isFolder: _isFolder = false, externalFileInfo } = {}
) {
  if (jsfile instanceof File || jsfile instanceof Blob) {
    const isFolder = _isFolder && jsfile.name?.endsWith('.zip');
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
      copyright: externalFileInfo?.copyright,
      externalUrl: externalFileInfo?.externalUrl,
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
        const etags = await sendAllChunksInOrder(
          filesToUpload[i],
          dbfile,
          ({ percentageCompleted }) => {
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
          }
        );
        await finishMultipartFileUpload(dbfile, filesToUpload[i].name, etags);
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
