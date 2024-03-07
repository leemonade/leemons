async function sendWelcomeEmailToUser(body) {
  return leemons.api('v1/users/users/activation-mail', {
    method: 'POST',
    body,
  });
}

export default sendWelcomeEmailToUser;
