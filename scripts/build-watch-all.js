const { spawn } = require('child_process');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Obtener todos los workspaces
const workspaces = JSON.parse(
  execSync('yarn workspaces info --json').toString()
);

Object.entries(workspaces).forEach(([name, info]) => {
  const packageJsonPath = path.join(info.location, 'package.json');

  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    if (
      !packageJson.name.includes('frontend') &&
      packageJson.scripts &&
      packageJson.scripts['build:watch']
    ) {
      console.log(`Starting build:watch for ${name}...`);
      const process = spawn('yarn', ['workspace', name, 'build:watch'], {
        stdio: 'pipe',
        shell: true,
      });

      process.stdout.on('data', (data) => {
        console.log(`[${name}] ${data}`);
      });

      process.stderr.on('data', (data) => {
        console.error(`[${name}] ${data}`);
      });

      process.on('close', (code) => {
        console.log(`${name} build:watch process exited with code ${code}`);
      });
    }
  }
});
