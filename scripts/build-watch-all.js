const { spawn } = require('child_process');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Obtener todos los workspaces
const workspaces = JSON.parse(
  execSync('yarn workspaces info --json').toString()
);

// Sort SDKs first, then process other workspaces
const sortedWorkspaces = Object.entries(workspaces).sort(([nameA], [nameB]) => {
  const isSDKA = nameA.startsWith('@leemons/');
  const isSDKB = nameB.startsWith('@leemons/');
  if (isSDKA && !isSDKB) return -1;
  if (!isSDKA && isSDKB) return 1;
  return 0;
});

sortedWorkspaces.forEach(([name, info]) => {
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
