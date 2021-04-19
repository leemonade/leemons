const ora = require('ora');
const execa = require('execa');

/*
 * Global Next.js Dependencies Installation
 */
function frontDeps() {
  const installSpinner = ora('Installing frontend dependencies').start();
  return execa
    .command(`yarn --cwd ${leemons.dir.next} --force`)
    .then(() => {
      installSpinner.succeed('Frontend dependencies installed');
    })
    .catch((e) => {
      installSpinner.fail("Frontend dependencies can't be installed");
      throw e;
    });
}

/*
 * Next.js Build
 */
function buildNext() {
  const spinner = ora('Building frontend').start();
  return execa
    .command(`yarn --cwd ${leemons.dir.next} build`)
    .then(() => {
      spinner.succeed('Frontend builded');
    })
    .catch((e) => {
      spinner.fail(`Frontend can't be builded`);
      throw e;
    });
}

async function build() {
  if (leemons.needsBuild) {
    await frontDeps();
    // await pluginsDeps();
    await buildNext();
  }
}

module.exports = build;
