const execa = require('execa');
// Intall front monorepo dependencies
module.exports = function installDeps(dir) {
  return new Promise((resolve, reject) => {
    const { stdout, stderr } = execa.command(`yarn --cwd ${dir}`);

    if (stderr) {
      stderr.on('data', (e) => {
        const message = e.toString();
        if (!message.startsWith('warning')) {
          reject(new Error(message));
        }
      });
    }

    if (stdout) {
      stdout.pipe(process.stdout);

      stdout.on('end', () => {
        resolve();
      });
    }
  });
};
