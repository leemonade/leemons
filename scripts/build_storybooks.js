/* eslint-disable no-console */
/* eslint-disable sonarjs/cognitive-complexity */
const fs = require('fs');
const path = require('path');
const { rimraf } = require('rimraf');
const { exec } = require('child_process');

function buildAllStorybooks(pluginsPath, docsBuildPath) {
  return new Promise((resolve, reject) => {
    const jsonData = [];
    fs.readdir(pluginsPath, (err, folders) => {
      if (err) {
        console.error(`Error reading plugins directory: ${err}`);
        reject(err);
        return;
      }

      let checkedFolders = 0;
      folders.forEach((folder) => {
        const frontendPath = path.join(pluginsPath, folder, 'frontend');
        const storybookPath = path.join(frontendPath, '.storybook');
        const packageJsonPath = path.join(frontendPath, 'package.json');

        fs.access(storybookPath, fs.constants.F_OK, (accessErr) => {
          if (!accessErr) {
            fs.readFile(packageJsonPath, 'utf8', (readFileErr, data) => {
              if (readFileErr) {
                console.error(`Error reading package.json for ${folder}: ${readFileErr}`);
                checkedFolders++;
                if (checkedFolders === folders.length) {
                  resolve(jsonData);
                }
                return;
              }

              const packageData = JSON.parse(data);
              const packageName = packageData.name;
              const buildCommand = `yarn workspace ${packageName} build-storybook -o ${path.join(
                docsBuildPath,
                folder
              )}`;
              exec(buildCommand, (execErr) => {
                if (execErr) {
                  console.error(`Error building storybook for ${folder}: ${execErr}`);
                  rimraf.sync(path.join(docsBuildPath, folder));
                } else {
                  console.log(`Successfully built storybook for ${folder}`);
                  jsonData.push({
                    name: packageData.displayName,
                    description: packageData.description,
                    url: folder,
                  });
                }
                checkedFolders++;
                if (checkedFolders === folders.length) {
                  resolve(jsonData);
                }
              });
            });
          } else {
            checkedFolders++;
            if (checkedFolders === folders.length) {
              resolve(jsonData);
            }
          }
        });
      });
    });
  });
}

(async () => {
  const pluginsPath = path.resolve(__dirname, '../plugins');
  const docsBuildPath = path.resolve(__dirname, '../docs-build');

  await rimraf(docsBuildPath);

  const jsonData = await buildAllStorybooks(pluginsPath, docsBuildPath);

  const indexHtmlPath = path.resolve(__dirname, './templates/storybooks_index.html');
  const outputHtmlPath = path.resolve(docsBuildPath, 'index.html');

  fs.readFile(indexHtmlPath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading index.html: ${err}`);
      return;
    }

    const modifiedData = data.replace(
      /var jsonData = \[\];/,
      `var jsonData = ${JSON.stringify(jsonData)};`
    );

    fs.writeFile(outputHtmlPath, modifiedData, 'utf8', (writeFileErr) => {
      if (writeFileErr) {
        console.error(`Error writing to output index.html: ${writeFileErr}`);
      } else {
        console.log('Successfully updated index.html with jsonData');
      }
    });
  });
})();
