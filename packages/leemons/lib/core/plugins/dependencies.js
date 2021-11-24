const _ = require('lodash');
const semverSatisfies = require('semver/functions/satisfies');

/**
 * Check if a plugin has dependencies
 * @param {{name: string, config: {dependencies: string[]}}} plugin
 * @returns {boolean}
 */
function hasDependencies(plugin) {
  return (
    plugin.config !== undefined &&
    plugin.config.dependencies &&
    Array.isArray(Object.keys(plugin.config.dependencies)) &&
    Object.keys(plugin.config.dependencies).length
  );
}

/**
 * Gets all the dependencies that a plugin needs directly or indirectly
 * @param {{name: string, config: {depencencies: {[name]: string}}}[]} plugins
 * @returns {{name: string, config: {dependencies: string[]}}} An array of {name, dependencies} objects defining each plugin dependencies
 */
function getDeepDependencies(plugins) {
  // Save the plugins already resolved for reusability
  const resolvedDependencies = {};
  // Remember the dependencies resolved for a given plugin (no-recheck)
  let lookedFor = [];

  const lookForDeepDeps = (plugin) => {
    let result = null;
    // If the plugin is already resolved, used the saved values
    if (resolvedDependencies[plugin.name]) {
      return resolvedDependencies[plugin.name];
    }
    // Add the current plugin as lookedUP
    lookedFor.push(plugin.name);
    // Check if the current plugin has deps
    if (hasDependencies(plugin)) {
      result = [
        ..._.flatten(
          plugins
            // Get the non already saved dependencies (not in lookedFor)
            .filter(
              (_plugin) =>
                plugin.config.dependencies[_plugin.name] && !lookedFor.includes(_plugin.name)
            )
            // Resolved the dependencies of this dependency
            .map((_plugin) => resolvedDependencies[_plugin.name] || lookForDeepDeps(_plugin))
        ),
        // Save the plugin direct dependencies
        ...Object.keys(plugin.config.dependencies),
      ];
    } else {
      result = [];
    }
    // Save this plugin dependencies
    resolvedDependencies[plugin.name] = result;
    return result;
  };

  // for each plugin resolve the deep dependencies
  return plugins.map((plugin) => {
    lookedFor = [];
    return {
      name: plugin.name,
      dependencies: [...new Set(lookForDeepDeps(plugin))].sort(),
    };
  });
}

/**
 * Resolve for each plugin the plugins that depends on it
 * @param {{name: string, config: {depencencies: {[name]: string}}}[]} plugins
 * @returns {{name: string, dependants: string[]}} An array of {name, dependants} objects defining each plugin dependants
 */
function getDependants(plugins) {
  return plugins.map((plugin) => ({
    name: plugin.name,
    dependants: plugins
      .filter((_plugin) => hasDependencies(_plugin) && _plugin.config.dependencies[plugin.name])
      .map((_plugin) => _plugin.name)
      .sort(),
  }));
}

/**
 * Resolves all the dependencies and dependants for each plugin
 * @param {{name: string, config: {depencencies: {[name]: string}}}[]} plugins
 * @returns {{name: string, dependencies: {{depencencies: {[name]: string}}, fullDependencies: string[], dependants: string[]}}} Returns an array with the plugins with a dependencies object {dependencies: {dependencies, fullDependencies, dependants}}
 */
function computeDependencies(plugins) {
  const dependencies = getDeepDependencies(plugins);
  const dependants = getDependants(plugins);
  return plugins.map((plugin, i) => ({
    ...plugin,
    dependencies: {
      dependencies: hasDependencies(plugin) ? plugin.config.dependencies : {},
      fullDepencencies: dependencies[i].dependencies,
      dependants: dependants[i].dependants,
    },
  }));
}

/**
 * Gets the plugins which dependencies are not met
 * @returns {{name: string, dependencies: {{depencencies: {[name]: string}}, fullDependencies: string[], dependants: string[]}}} plugins
 * @returns {string[]} An array with the plugins not meeting its dependencies
 */
function checkMissingDependencies(plugins) {
  return plugins
    .filter((plugin) => {
      const dependencies = Object.entries(plugin.dependencies.dependencies);

      const allSatisfied = dependencies
        .map(([name, version]) => {
          const _plugin = plugins.find((__plugin) => __plugin.name === name);
          // true when dependency and version satisfied and false when not
          return !(!_plugin || !semverSatisfies(_plugin.version, version));
        })
        // All the dependencies are met?
        .every((satisfied) => satisfied === true);

      return !allSatisfied;
    })
    .map((plugin) => plugin.name);
}

/**
 * Sort the plugins array based on its dependencies
 *
 * It is recommended to not have circular deps in order to work as intended
 * @returns {{name: string, dependencies: {{depencencies: {fullDependencies: string[]}}} plugins
 * @returns {string[]} An array with the plugins sorted by its dependencies
 */
function sortByDeps(plugins) {
  return [...plugins].sort((a, b) => {
    // > 0 b is before a
    // < 0 a is before b
    // 0 No change

    // If only B has deps, then A loads before B
    if (hasDependencies(b) && !hasDependencies(a)) return -1;
    // If only A has deps, then B loads before A
    if (hasDependencies(a) && !hasDependencies(b)) return 1;
    // If B depends on A, then A loads before B
    if (hasDependencies(b) && b.dependencies.fullDepencencies.includes(a.name)) return -1;
    // If A depends on B, then B loads before A
    if (hasDependencies(a) && a.dependencies.fullDepencencies.includes(b.name)) return 1;
    // Else don't sort
    return 0;
  });
}

module.exports = {
  hasDependencies,
  getDeepDependencies,
  getDependants,
  computeDependencies,
  checkMissingDependencies,
  sortByDeps,
};
