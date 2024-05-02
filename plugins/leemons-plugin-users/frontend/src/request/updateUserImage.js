import uploadFileAsMultipart from '@leebrary/helpers/uploadFileAsMultipart';

async function updateUserImage(user, file, setUploadingFileInfo = () => {}) {
  let image = null;
  if (file) {
    image = await uploadFileAsMultipart(file, {
      name: file.name,
      onProgress: (info) => setUploadingFileInfo(info),
    });
  }
  const body = { image };

  return leemons.api(`v1/users/users/${user}/update-avatar`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default updateUserImage;
