const ora = require('ora');
const execa = require('execa');
const fs = require('fs-extra');
const path = require('path');
const hooks = require('leemons-hooks');

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
  // If node_modules is not created, install deps
  if (!fs.existsSync(path.resolve(leemons.dir.next, 'node_modules'))) {
    leemons.frontNeedsUpdateDeps = true;
  }

  if (leemons.frontNeedsUpdateDeps) {
    await hooks.fireEvent('leemons::installDeps', { status: 'start' });
    await frontDeps();
    await hooks.fireEvent('leemons::installDeps', { status: 'end' });
  }
  if (leemons.frontNeedsBuild) {
    await hooks.fireEvent('leemons::build', { status: 'start' });
    await buildNext();
    await hooks.fireEvent('leemons::build', { status: 'end' });
  }
}

module.exports = build;
