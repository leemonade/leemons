const ora = require('ora');
const execa = require('execa');
const fs = require('fs-extra');
const path = require('path');
const { nextTransform, frontLogger } = require('./streams');

/*
 * Global frontend Dependencies Installation
 */
async function frontDeps() {
  // Check if the dependencies are installed
  if (!(await fs.exists(path.resolve(leemons.dir.frontend, 'node_modules')))) {
    leemons.frontNeedsUpdateDeps = true;
  }

  // Install dependencies when needed
  if (leemons.frontNeedsUpdateDeps) {
    leemons.events.emit('frontWillInstallDeps', 'leemons');
    const installSpinner = ora('Installing frontend dependencies').start();
    return execa
      .command(`yarn --cwd ${leemons.dir.frontend} --force`)
      .then(() => {
        installSpinner.succeed('Frontend dependencies installed');
      })
      .catch(async (e) => {
        installSpinner.fail("Frontend dependencies can't be installed");
        await fs.remove(path.resolve(leemons.dir.frontend, 'node_modules'));
        leemons.log.throw(e);
      })
      .finally(async () => {
        leemons.events.emit('frontDidInstallDeps', 'leemons');
      });
  }
  return null;
}

/*
 * Frontend Build
 */
async function buildFrontend() {
  // Do not build if is a dev environment
  if (process.env.NODE_ENV !== 'development') {
    // Check if a production build exists
    if (!(await fs.exists(path.resolve(leemons.dir.frontend, '.frontend', 'BUILD_ID')))) {
      leemons.frontNeedsBuild = true;
    }

    // Build if necessary
    if (leemons.frontNeedsBuild && process.env.NODE_ENV !== 'development') {
      leemons.events.emit('frontWillBuild', 'leemons');
      const spinner = ora('Building frontend').start();
      return new Promise((resolve) => {
        const build = execa.command(`yarn --cwd ${leemons.dir.frontend} build`, {
          ...process.env,
          FORCE_COLOR: true,
        });
        // Log the stdout and stderr
        build.stdout.pipe(frontLogger('info'));

        build.stderr
          .pipe(
            nextTransform('error Command failed', () => {
              spinner.fail('Frontend build failed');
              leemons.events.emit('frontDidCrash', 'leemons');
              resolve(false);
            })
          )
          .pipe(frontLogger('error'));

        // When the build ends, the front was builded successfully
        build
          .then(() => {
            spinner.succeed('Frontend builded successfully');
            leemons.events.emit('frontDidBuild', 'leemons');
            resolve(true);
          })
          .catch(() => {});
      });
    }
  }
  return true;
}

async function buildFront() {
  await frontDeps();
  return buildFrontend();
}

module.exports = buildFront;
