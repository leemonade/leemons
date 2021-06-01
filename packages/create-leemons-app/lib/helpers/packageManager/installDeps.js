const { command } = require('execa');

module.exports = async (dir, dependencies, useYarn) => {
  if (useYarn) {
    await command(`yarn --cwd ${dir} add ${dependencies.join(' ')}`, {
      stdio: 'inherit',
    });
  } else {
    console.error('Npm not yet supported');
    process.exit(1);
  }
};
