const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Obtener todos los workspaces
const workspaces = JSON.parse(execSync('yarn workspaces info --json').toString());

Object.entries(workspaces).forEach(([name, info]) => {
  const packageJsonPath = path.join(info.location, 'package.json');

  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    if (packageJson.scripts && packageJson.scripts.build) {
      console.log(`Building ${name}...`);
      try {
        execSync(`yarn workspace ${name} build`, { stdio: 'inherit' });
      } catch (error) {
        console.error(`Error building ${name}: ${error.message}`);
      }
    }
  }
});
