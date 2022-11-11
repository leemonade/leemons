const _ = require('lodash');
const path = require('path');
const { PLUGIN_STATUS } = require('./pluginsStatus');
const { loadFiles, loadFile } = require('../config/loadFiles');
const disablePlugin = require('./disablePlugin');
const { formatModels } = require('../model/loadModel');
const transformServices = require('./transformServices');

class ScriptLoader {
  constructor(target, singularTarget) {
    this.target = target;
    this.singularTarget = singularTarget;
  }

  async loadScript(
    {
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
    },
    beforeDidLoadEventCallback
  ) {
    if (plugin.status.code === PLUGIN_STATUS.enabled.code) {
      if (willLoadEvent) {
        leemons.events.emit(
          `${this.singularTarget}${willLoadEvent}`,
          `${this.target}.${plugin.name}`
        );
      }
      try {
        const func = singleFile ? loadFile : loadFiles;

        const result = await func(path.join(plugin.dir.app, dir), {
          execFunction,
          env,
          filter,
          allowedPath: plugin.dir.app,
          exclude,
          plugin,
          type: this.singularTarget,
        });
        if (_.isFunction(beforeDidLoadEventCallback)) beforeDidLoadEventCallback(result);
        if (didLoadEvent) {
          leemons.events.emit(
            `${this.singularTarget}${didLoadEvent}`,
            `${this.target}.${plugin.name}`
          );
        }
        return { error: null, result };
      } catch (e) {
        console.error(e);
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
      await leemons.models[this.target].installed(plugin.name);
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
    return (
      await this.loadScript(
        {
          plugins,
          plugin,
          dir: plugin.dir.services,
          willLoadEvent: 'WillLoadServices',
          didLoadEvent: 'DidLoadServices',
          failStatus: PLUGIN_STATUS.servicesFailed,
          env,
          filter,
          execFunction: false,
        },
        (services) => {
          _.set(
            plugin,
            'services',
            transformServices(services, `${this.target}.${plugin.name}`, true)
          );
        }
      )
    ).result;
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
            (await loadFile(`${routesDir}.js`, {
              env,
              filter,
              allowedPath: plugin.dir.app,
              plugin,
            })) ||
            (await loadFile(`${routesDir}.json`, {
              env,
              filter,
              allowedPath: plugin.dir.app,
              plugin,
            })) ||
            [];

          leemons.events.emit(
            `${this.singularTarget}DidLoadRoutes`,
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
        didLoadEvent: 'DidLoadControllers',
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
      plugin,
    });

    if (_.isFunction(func)) {
      return {
        exists: true,
        func,
      };
    }

    return { exists: false };
  }

  async loadModels(plugins, plugin, env, filter) {
    const { error, result } = await this.loadScript({
      plugins,
      plugin,
      dir: plugin.dir.models,
      willLoadEvent: 'WillLoadModels',
      didLoadEvent: null,
      failStatus: PLUGIN_STATUS.servicesFailed,
      env,
      filter,
      execFunction: false,
    });

    if (error || result === null) {
      _.set(plugin, 'models', result);
      return result;
    }

    const models = formatModels(result, `${this.target}.${plugin.name}`);
    _.set(plugin, 'models', models);
    _.set(leemons, `${this.target}.${plugin.name}`, plugin);
    await leemons.db.loadModels(models);
    leemons.events.emit(`${this.singularTarget}DidLoadModels`, `${this.target}.${plugin.name}`);
    return models;
  }

  async loadEvents(plugins, plugin, env, filter) {
    const event = (
      await this.loadScript({
        plugins,
        plugin,
        dir: plugin.dir.events,
        willLoadEvent: 'WillSetEvents',
        didLoadEvent: null, // 'DidSetEvents',
        failStatus: PLUGIN_STATUS.eventsFailed,
        env,
        filter,
        execFunction: false,
        singleFile: true,
      })
    ).result;

    let result = null;
    if (event) {
      result = await event(plugin.status.isInstalled);
    }
    leemons.events.emit('pluginDidSetEvents', `${this.target}.${plugin.name}`);
    return result;
  }
}

module.exports = ScriptLoader;
