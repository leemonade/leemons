const { command: execCommand } = require('execa');

module.exports = async (dir, dependencies, useYarn) => {
  let command;
  if (useYarn) {
    command = `yarn --cwd ${dir} add ${dependencies.join(' ')}`;
  } else {
    command = `npm install -p ${dir} ${dependencies.join(' ')}`;
  }

  try {
    await execCommand(command, { stdio: 'inherit' });
    return true;
  } catch (e) {
    return false;
  }
};
