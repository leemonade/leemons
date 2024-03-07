async function sendNewProfileAddedEmailToUser({ user, profile, ctx }) {
  return ctx.tx.call('emails.email.sendAsPlatform', {
    to: user.email,
    templateName: 'user-new-profile-added',
    language: user.locale,
    context: {
      userName: user.name,
      profileName: profile.name,
    },
  });
}

module.exports = { sendNewProfileAddedEmailToUser };
