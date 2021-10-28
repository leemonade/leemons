import * as _ from 'lodash';

async function uploadFiles(files) {
  const formData = new FormData();
  if (files.constructor.name === 'FileList') {
    // eslint-disable-next-line no-restricted-syntax
    for (const file of files) {
      formData.append('files', file, file.name);
    }
  } else {
    formData.append('files', files);
  }

  return leemons.api('media-library/upload', {
    allAgents: true,
    method: 'POST',
    body: formData,
    headers: {
      'content-type': null,
    },
  });
}

export default uploadFiles;
