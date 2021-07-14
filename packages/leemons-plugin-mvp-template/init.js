const initProfiles = require('./src/profiles');
const initUsers = require('./src/users');

async function init() {
  try {
    console.log('Before profiles');
    const profiles = await initProfiles();
    console.log('profiles', profiles);
    const users = await initUsers(profiles);
    console.log('users', users);
  } catch (e) {}
}

module.exports = init;
