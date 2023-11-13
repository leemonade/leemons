import uploadFileAsMultipart from '@leebrary/helpers/uploadFileAsMultipart';

async function updateUserImage(user, file) {
  const image = await uploadFileAsMultipart(file, { name: file.name });
  return leemons.api(`v1/users/users/${user}/update-avatar`, {
    allAgents: true,
    method: 'POST',
    headers: {
      'content-type': 'none',
    },
    body: { image },
  });
}

export default updateUserImage;
