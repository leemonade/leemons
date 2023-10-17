async function updateUserImage(user, file) {
  const form = new FormData();
  form.append('image', file, file.name);
  return leemons.api(`users/user/${user}/update-avatar`, {
    allAgents: true,
    method: 'POST',
    headers: {
      'content-type': 'none',
    },
    body: form,
  });
}

export default updateUserImage;
