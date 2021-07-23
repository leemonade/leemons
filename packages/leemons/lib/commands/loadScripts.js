const _ = require('lodash');
const path = require('path');
const { PLUGIN_STATUS } = require('./pluginsStatus');
const { loadFiles, loadFile } = require('../core/config/loadFiles');
const disablePlugin = require('./disablePlugin');

class ScriptLoader {
  constructor(target, singularTarget) {
    this.target = target;
    this.singularTarget = singularTarget;
  }

  async loadScript({
    plugins,
    plugin,
    dir,
    willLoadEvent,
    didLoadEvent,
    failStatus,
    env,
    filter,
    execFunction = true,
    singleFile = false,
    exclude = [],
  }) {
    if (plugin.status.code === PLUGIN_STATUS.enabled.code) {
      leemons.events.emit(
        `${this.singularTarget}${willLoadEvent}`,
        `${this.target}.${plugin.name}`
      );
      try {
        const func = singleFile ? loadFile : loadFiles;

        const result = await func(path.join(plugin.dir.app, dir), {
          execFunction,
          env,
          filter,
          allowedPath: plugin.dir.app,
          exclude,
        });
        leemons.events.emit(
          `${this.singularTarget}${didLoadEvent}`,
          `${this.target}.${plugin.name}`
        );
        return { error: null, result };
      } catch (e) {
        disablePlugin(plugins, plugin, failStatus);
        return { error: e, result: null };
      }
    } else {
      return { error: null, result: null };
    }
  }

  async loadInstall(plugins, plugin, env, filter) {
    const installation = await this.loadScript({
      plugins,
      plugin,
      dir: plugin.dir.install,
      willLoadEvent: `WillInstall`,
      didLoadEvent: `DidInstall`,
      failStatus: PLUGIN_STATUS.installationFailed,
      env,
      filter,
      singleFile: true,
    });

    if (!installation.error) {
      _.set(plugin, 'status.isInstalled', true);
      await leemons.models.plugins.installed(plugin.name);
    }
  }

  loadInit(plugins, plugin, env, filter) {
    return this.loadScript({
      plugins,
      plugin,
      dir: plugin.dir.init,
      willLoadEvent: 'WillInit',
      didLoadEvent: 'DidInit',
      failStatus: PLUGIN_STATUS.initializationFailed,
      env,
      filter,
      singleFile: true,
    });
  }

  async loadServices(plugins, plugin, env, filter) {
    const services = (
      await this.loadScript({
        plugins,
        plugin,
        dir: plugin.dir.services,
        willLoadEvent: 'WillLoadServices',
        didLoadEvent: 'DidLoadedServices',
        failStatus: PLUGIN_STATUS.servicesFailed,
        env,
        filter,
        execFunction: false,
      })
    ).result;
    _.set(plugin, 'services', services);

    return services;
  }

  async loadRoutes(plugins, plugin, env, filter) {
    const func = async () => {
      if (plugin.status.code === PLUGIN_STATUS.enabled.code) {
        leemons.events.emit(
          `${this.singularTarget}WillLoadRoutes`,
          `${this.target}.${plugin.name}`
        );
        try {
          const routesDir = path.join(plugin.dir.app, plugin.dir.controllers, 'routes');

          // Try to load routes.js, if not exists, load routes.json, if none exists, set the routes to empty array
          const routes =
            (await loadFile(`${routesDir}.js`, { env, filter, allowedPath: plugin.dir.app })) ||
            (await loadFile(`${routesDir}.json`, { env, filter, allowedPath: plugin.dir.app })) ||
            [];

          leemons.events.emit(
            `${this.singularTarget}DidLoadedRoutes`,
            `${this.target}.${plugin.name}`
          );
          return routes;
        } catch (e) {
          disablePlugin(plugins, plugin, PLUGIN_STATUS.routesFailed);
          return null;
        }
      } else {
        return null;
      }
    };

    const routes = await func();
    _.set(plugin, 'routes', routes);
    return routes;
  }

  async loadControllers(plugins, plugin, env, filter) {
    const routesDir = path.join(plugin.dir.app, plugin.dir.controllers, 'routes');

    const controllers = (
      await this.loadScript({
        plugins,
        plugin,
        dir: plugin.dir.controllers,
        willLoadEvent: 'WillLoadControllers',
        didLoadEvent: 'DidLoadedControllers',
        failStatus: PLUGIN_STATUS.controllersFailed,
        env,
        filter,
        exclude: [`${routesDir}.js`, `${routesDir}.json`],
      })
    ).result;

    _.set(plugin, 'controllers', controllers);
    return controllers;
  }

  // eslint-disable-next-line class-methods-use-this
  async customLoad(plugin, env, filter) {
    const dir = path.join(plugin.dir.app, plugin.dir.load);
    const func = await loadFile(dir, {
      filter,
      allowedPath: plugin.dir.app,
      env,
      execFunction: false,
    });

    if (_.isFunction(func)) {
      return {
        exists: true,
        func,
      };
    }

    return { exists: false };
  }
}

module.exports = ScriptLoader;
