async function sendWelcomeEmailToUser(body) {
  return leemons.api('users/user/activation-mail', {
    method: 'POST',
    body,
  });
}

export default sendWelcomeEmailToUser;
