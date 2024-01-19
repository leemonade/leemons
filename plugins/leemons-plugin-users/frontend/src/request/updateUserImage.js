import uploadFileAsMultipart from '@leebrary/helpers/uploadFileAsMultipart';

async function updateUserImage(user, file) {
  const image = await uploadFileAsMultipart(file, { name: file.name });
  const body = { image };

  return leemons.api(`v1/users/users/${user}/update-avatar`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default updateUserImage;
