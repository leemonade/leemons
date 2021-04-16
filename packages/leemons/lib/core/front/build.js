const ora = require('ora');
const execa = require('execa');
const fs = require('fs-extra');
const path = require('path');

/*
 * Global Next.js Dependencies Installation
 */
function frontDeps() {
  const installSpinner = ora('Installing frontend dependencies').start();
  return execa
    .command(`yarn --cwd ${leemons.dir.next}`)
    .then(() => {
      installSpinner.succeed('Frontend dependencies installed');
    })
    .catch((e) => {
      installSpinner.fail("Frontend dependencies can't be installed");
      throw e;
    });
}

/*
 * Plugin Dependencies Installation
 */
function pluginsDeps() {
  const plugins = fs
    .readdirSync(path.resolve(leemons.dir.next, 'src'), { withFileTypes: true })
    .filter((file) => file.isDirectory())
    .map((directory) => path.resolve(leemons.dir.next, 'src', directory.name))
    .filter((directory) => fs.existsSync(path.resolve(directory, 'package.json')));

  const pluginsInstallSpinner = ora(`Installing plugins dependencies`).start();

  let i = 0;
  const pluginsLength = plugins.length;

  return Promise.all(
    plugins.map((directory) =>
      execa
        .command(`yarn --cwd ${directory}`)
        .then((r) => {
          i++;
          pluginsInstallSpinner.text = `Plugins dependencies installed [${i}/${pluginsLength}]`;
          return r;
        })
        .catch((e) => {
          pluginsInstallSpinner.fail("Plugins dependencies can't be installed");
          throw e;
        })
    )
  ).then(() => {
    pluginsInstallSpinner.succeed('Plugins dependencies installed');
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
    await pluginsDeps();
    await buildNext();
  }
}

module.exports = build;
