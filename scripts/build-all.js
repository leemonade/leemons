const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const buildSdkOnly = args.includes('--sdk');
const buildPluginsOnly = args.includes('--plugin');

// Get all workspaces info
const workspaces = JSON.parse(execSync('yarn workspaces info --json').toString());

// Create a graph of dependencies
function createDependencyGraph(workspaces) {
  const graph = {};

  Object.entries(workspaces).forEach(([name, info]) => {
    const packageJsonPath = path.join(info.location, 'package.json');

    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const dependencies = {
        ...(packageJson.dependencies || {}),
        ...(packageJson.devDependencies || {}),
      };

      // Initialize the graph entry even if there are no dependencies
      graph[name] = [];

      // Only track @leemons dependencies that exist in our workspaces
      Object.keys(dependencies).forEach((dep) => {
        if (dep.startsWith('@leemons/') && workspaces[dep]) {
          graph[name].push(dep);
        }
      });
    }
  });

  // Debug information
  /*
  console.log('\nDependency Graph:');
  Object.entries(graph).forEach(([pkg, deps]) => {
    if (deps.length > 0) {
      console.log(`${pkg} depends on:`, deps);
    }
  });
  console.log('\n');
  */

  return graph;
}

// Calculate dependency depth for each package
function calculateDependencyDepth(graph) {
  const depths = {};
  const visited = new Set();
  const visiting = new Set(); // For cycle detection

  function dfs(pkg) {
    // Return -1 for packages not in the graph
    if (!graph[pkg]) {
      return -1;
    }

    // Detect cycles
    if (visiting.has(pkg)) {
      console.warn(`Warning: Circular dependency detected involving ${pkg}`);
      return depths[pkg] || 0;
    }

    if (visited.has(pkg)) {
      return depths[pkg];
    }

    visiting.add(pkg);

    if (graph[pkg].length === 0) {
      depths[pkg] = 0;
      visited.add(pkg);
      visiting.delete(pkg);
      return 0;
    }

    const dependencyDepths = graph[pkg].map((dep) => dfs(dep));
    depths[pkg] = Math.max(...dependencyDepths.filter((d) => d >= 0)) + 1;

    visited.add(pkg);
    visiting.delete(pkg);
    return depths[pkg];
  }

  Object.keys(graph).forEach((pkg) => {
    if (!visited.has(pkg)) {
      dfs(pkg);
    }
  });

  // Debug information
  /*
  console.log('Dependency Depths:');
  Object.entries(depths)
    .sort((a, b) => a[1] - b[1])
    .forEach(([pkg, depth]) => {
      console.log(`${pkg}: ${depth}`);
    });
  console.log('\n');
  */

  return depths;
}

// Main execution
const graph = createDependencyGraph(workspaces);
const depths = calculateDependencyDepth(graph);

// Sort packages by dependency depth (less dependencies first)
const sortedPackages = Object.entries(workspaces)
  .filter(([name]) => {
    if (buildSdkOnly) {
      return name.startsWith('@leemons/');
    }
    if (buildPluginsOnly) {
      return name.startsWith('leemons-plugin-');
    }
    return name.startsWith('@leemons/') || name.startsWith('leemons-plugin-');
  })
  .sort(([nameA], [nameB]) => (depths[nameA] || 0) - (depths[nameB] || 0));

// Log build mode
if (buildSdkOnly) {
  console.log('\nBuilding SDK packages only (@leemons/*)...\n');
} else if (buildPluginsOnly) {
  console.log('\nBuilding Plugin packages only (leemons-plugin-*)...\n');
} else {
  console.log('\nBuilding all packages...\n');
}

// Build packages in order
sortedPackages.forEach(([name, info]) => {
  const packageJsonPath = path.join(info.location, 'package.json');

  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    if (
      !packageJson.name.includes('frontend') &&
      packageJson.scripts &&
      packageJson.scripts.build
    ) {
      console.log(`Building ${name}... (dependency depth: ${depths[name] || 0})`);
      try {
        execSync(`yarn workspace ${name} build`, { stdio: 'inherit' });
      } catch (error) {
        console.error(`Error building ${name}: ${error.message}`);
        process.exit(1); // Exit if any build fails since dependencies are ordered
      }
    }
  }
});
