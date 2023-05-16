async function sendNewProfileAddedEmailToUser(user, profile, ctx) {
  return leemons
    .getPlugin('emails')
    .services.email.sendAsPlatform(user.email, 'user-new-profile-added', user.locale, {
      userName: user.name,
      profileName: profile.name,
    });
}

module.exports = { sendNewProfileAddedEmailToUser };
