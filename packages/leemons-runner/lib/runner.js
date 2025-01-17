/* eslint-disable no-param-reassign */
const { ServiceBroker, Utils } = require('moleculer');

const utils = Utils;
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const Args = require('args');
const os = require('os');
const cluster = require('cluster');
const kleur = require('kleur');
const { mongoose } = require('@leemons/mongodb');

// Register Babel for JSX files
require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-react'],
  ignore: [
    (filename) => {
      // Ignorar archivos dentro de node_modules
      if (filename.includes('/node_modules/')) {
        return true; // Ignorar
      }
      return !filename.endsWith('.jsx');
    },
  ],
});

const stopSignals = [
  'SIGHUP',
  'SIGINT',
  'SIGQUIT',
  'SIGILL',
  'SIGTRAP',
  'SIGABRT',
  'SIGBUS',
  'SIGFPE',
  'SIGUSR1',
  'SIGSEGV',
  'SIGUSR2',
  'SIGTERM',
];

/* eslint-disable no-console */

/**
 * Logger helper
 *
 */
const logger = {
  info(message) {
    console.log(kleur.grey('[Runner]'), kleur.green().bold(message));
  },
  error(err) {
    if (err instanceof Error)
      console.error(kleur.grey('[Runner]'), kleur.red().bold(err.message), err);
    else console.error(kleur.grey('[Runner]'), kleur.red().bold(err));
  },
};

class LeemonsRunner {
  constructor() {
    this.watchFolders = [];

    this.flags = null;
    this.configFile = null;
    this.config = null;
    this.servicePaths = null;
    this.broker = null;
    this.worker = null;
  }

  /**
   * Process command line arguments
   *
   * Available options:
   -c, --config     Load the configuration from a file
   -e, --env        Load .env file from the current directory
   -E, --envfile    Load a specified .env file
   -h, --help       Output usage information
   -H, --hot        Hot reload services if changed (disabled by default)
   -i, --instances  Launch [number] instances node (load balanced)
   -m, --mask       Filemask for service loading
   -r, --repl       Start REPL mode (disabled by default)
   -s, --silent     Silent mode. No logger (disabled by default)
   -v, --version    Output the version number
   */
  processFlags(procArgs) {
    Args.option('config', 'Load the configuration from a file')
      .option('repl', 'Start REPL mode', false)
      .option(['H', 'hot'], 'Hot reload services if changed', false)
      .option('silent', 'Silent mode. No logger', false)
      .option('env', 'Load .env file from the current directory')
      .option('envfile', 'Load a specified .env file')
      .option('instances', 'Launch [number] instances node (load balanced)')
      .option('mask', 'Filemask for service loading');

    this.flags = Args.parse(procArgs, {
      mri: {
        alias: {
          c: 'config',
          r: 'repl',
          H: 'hot',
          s: 'silent',
          e: 'env',
          E: 'envfile',
          i: 'instances',
          m: 'mask',
        },
        boolean: ['repl', 'silent', 'hot', 'env'],
        string: ['config', 'envfile', 'mask'],
      },
    });

    this.servicePaths = Args.sub;
  }

  /**
   * Load environment variables from '.env' file
   */
  loadEnvFile() {
    if (this.flags.env || this.flags.envfile) {
      try {
        const dotenv = require('dotenv');

        if (this.flags.envfile) dotenv.config({ path: this.flags.envfile });
        else dotenv.config();
      } catch (err) {
        throw new Error(
          "The 'dotenv' package is missing! Please install it with 'npm install dotenv --save' command."
        );
      }
    }
  }

  /**
   * Fix Uppercase drive letter issue on Windows. It causes problem on custom modules detection (XY instanceof Base)
   * Unused currently, because it causes problem: https://github.com/moleculerjs/moleculer/issues/788
   *
   * More info: https://github.com/nodejs/node/issues/6978
   * @param {String} s
   * @returns {String}
   */
  fixDriveLetterCase(s) {
    if (s && process.platform === 'win32' && s.match(/^[A-Z]:/g)) {
      return s.charAt(0).toLowerCase() + s.slice(1);
    }
    return s;
  }

  /**
   * Load configuration file
   *
   * Try to load a configuration file in order to:
   *
   *        - load file defined in MOLECULER_CONFIG env var
   *        - try to load file which is defined in CLI option with --config
   *        - try to load the `moleculer.config.js` file if exist in the cwd
   *        - try to load the `moleculer.config.json` file if exist in the cwd
   */
  loadConfigFile() {
    let filePath;
    // Env vars have priority over the flags
    const configPath = process.env.MOLECULER_CONFIG || this.flags.config;

    if (configPath != null) {
      if (path.isAbsolute(configPath)) {
        filePath = this.tryConfigPath(configPath);
      } else {
        filePath = this.tryConfigPath(path.resolve(process.cwd(), configPath));

        if (filePath == null) {
          filePath = this.tryConfigPath(configPath, true);
        }
      }

      if (filePath == null) {
        return Promise.reject(new Error(`Config file not found: ${configPath}`));
      }
    }

    if (filePath == null) {
      filePath = this.tryConfigPath(path.resolve(process.cwd(), 'moleculer.config.js'));
    }
    if (filePath == null) {
      filePath = this.tryConfigPath(path.resolve(process.cwd(), 'moleculer.config.json'));
    }

    if (filePath != null) {
      const ext = path.extname(filePath);
      switch (ext) {
        case '.json':
        case '.js':
        case '.ts': {
          const content = require(filePath);
          return Promise.resolve()
            .then(() => {
              if (utils.isFunction(content)) return content.call(this);
              return content;
            })
            .then((res) => {
              this.configFile = res.default != null && res.__esModule ? res.default : res;
              return this.configFile;
            });
        }
        default:
          return Promise.reject(new Error(`Not supported file extension: ${ext}`));
      }
    }
  }

  /**
   * Try to resolve a configuration file at a path
   * @param {string} configPath - Path to attempt resolution from
   * @param {boolean} [startFromCwd=false] - Start resolution from current working directory
   * @returns {string | null}
   */
  tryConfigPath(configPath, startFromCwd = false) {
    let resolveOptions;
    if (startFromCwd) {
      resolveOptions = { paths: [process.cwd()] };
    }

    try {
      return require.resolve(configPath, resolveOptions);
    } catch (e) {
      return null;
    }
  }

  normalizeEnvValue(value) {
    if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
      // Convert to boolean
      return value === 'true';
    }

    if (!Number.isNaN(value)) {
      // Convert to number
      return Number(value);
    }

    return value;
  }

  overwriteFromEnv(obj, prefix) {
    Object.keys(obj).forEach((key) => {
      const envName = ((prefix ? `${prefix}_` : '') + key).toUpperCase();

      if (process.env[envName]) {
        obj[key] = this.normalizeEnvValue(process.env[envName]);
      }

      if (utils.isPlainObject(obj[key]))
        obj[key] = this.overwriteFromEnv(obj[key], (prefix ? `${prefix}_` : '') + key);
    });

    // Process MOL_ env vars only the root level
    if (prefix == null) {
      const moleculerPrefix = 'MOL_';
      Object.keys(process.env)
        .filter((key) => key.startsWith(moleculerPrefix))
        .map((key) => ({
          key,
          withoutPrefix: key.substring(moleculerPrefix.length),
        }))
        .forEach((variable) => {
          const dotted = variable.withoutPrefix
            .split('__')
            .map((level) => level.toLocaleLowerCase())
            .map((level) =>
              level
                .split('_')
                .map((value, index) => {
                  if (index === 0) {
                    return value;
                  }
                  return value[0].toUpperCase() + value.substring(1);
                })
                .join('')
            )
            .join('.');
          obj = utils.dotSet(obj, dotted, this.normalizeEnvValue(process.env[variable.key]));
        });
    }

    return obj;
  }

  /**
   * Merge broker options
   *
   * Merge options from environment variables and config file. First
   * load the config file if exists. After it overwrite the vars from
   * the environment values.
   *
   * Example options:
   *
   *    Original broker option: `logLevel`
   *  Config file property: 	`logLevel`
   *  Env variable:			`LOGLEVEL`
   *
   *    Original broker option: `circuitBreaker.enabled`
   *  Config file property: 	`circuitBreaker.enabled`
   *  Env variable:			`CIRCUITBREAKER_ENABLED`
   *
   */
  mergeOptions() {
    this.config = _.defaultsDeep(this.configFile, ServiceBroker.defaultOptions);
    this.config = this.overwriteFromEnv(this.config);
    this.config.errorHandler = (err, params) => {
      if (err?.data?.ignoreStack) {
        err.stack = '';
        delete err.data.ignoreStack;
      }

      if (params.event) {
        return { err, params };
      }

      throw err;
    };

    if (this.flags.silent) {
      this.config.logger = false;
    }

    if (this.flags.hot) {
      this.config.hotReload = true;
    }
  }

  /**
   * Check the given path whether directory or not
   *
   * @param {String} p
   * @returns {Boolean}
   */
  isDirectory(p) {
    try {
      return fs.lstatSync(p).isDirectory();
    } catch (e) {
      // ignore
    }
    return false;
  }

  /**
   * Check the given path whether a file or not
   *
   * @param {String} p
   * @returns {Boolean}
   */
  isServiceFile(p) {
    try {
      return !fs.lstatSync(p).isDirectory();
    } catch (e) {
      // ignore
    }
    return false;
  }

  getDependenciesFromNPM() {
    const serviceDir = process.env.SERVICEDIR || '';
    const svcDir = path.isAbsolute(serviceDir)
      ? serviceDir
      : path.resolve(process.cwd(), serviceDir);

    const packageJsonPath = path.join(svcDir, 'package.json');
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);

    // We are executed inside a plugin
    if (packageJson.name.indexOf('leemons-plugin-') === 0) {
      return [
        {
          name: packageJson.name,
          path: './',
        },
      ];
    }

    const dependencies = Object.keys(packageJson.dependencies);

    const result = [];
    _.forEach(dependencies, (dependency) => {
      try {
        if (dependency.startsWith('leemons-plugin-')) {
          result.push({
            name: dependency,
            path: require.resolve(`${dependency}/package.json`).replace('/package.json', ''),
          });
        }
      } catch (error) {
        logger.error(`No se pudo resolver la dependencia "${dependency}": ${error}`);
      }
    });

    console.log(result);

    return result;
  }

  /**
   * Load services from files or directories
   *
   * 1. If find `SERVICEDIR` env var and not find `SERVICES` env var, load all services from the `SERVICEDIR` directory
   * 2. If find `SERVICEDIR` env var and `SERVICES` env var, load the specified services from the `SERVICEDIR` directory
   * 3. If not find `SERVICEDIR` env var but find `SERVICES` env var, load the specified services from the current directory
   * 4. check the CLI arguments. If it find filename(s), load it/them
   * 5. If find directory(ies), load it/them
   *
   * Please note: you can use shorthand names for `SERVICES` env var.
   *    E.g.
   *        SERVICES=posts,users
   *
   *        It will be load the `posts.service.js` and `users.service.js` files
   *
   *
   */
  loadServices() {
    this.watchFolders.length = 0;
    const fileMask = this.flags.mask || '**/*.service.js';
    const dependencies = this.getDependenciesFromNPM();
    _.forEach(dependencies, (dependency) => {
      if (this.config.logger)
        logger.info(`Loading service (${dependency.name}) from path ${dependency.path}`);
      this.broker.loadServices(dependency.path, fileMask);

      if (this.config.hotReload && !dependency.path.endsWith('frontend')) {
        this.watchFolders.push(dependency.path);
      }
    });
  }

  /**
   * Start cluster workers
   */
  startWorkers(instances) {
    let stopping = false;

    cluster.on('exit', (worker, code) => {
      if (!stopping) {
        // only restart the worker if the exit was by an error
        if (process.env.NODE_ENV === 'production' && code !== 0) {
          logger.info(`The worker #${worker.id} has disconnected`);
          logger.info(`Worker #${worker.id} restarting...`);
          cluster.fork();
          logger.info(`Worker #${worker.id} restarted`);
        } else {
          process.exit(code);
        }
      }
    });

    const workerCount = Number.isInteger(instances) && instances > 0 ? instances : os.cpus().length;

    logger.info(`Starting ${workerCount} workers...`);

    for (let i = 0; i < workerCount; i++) {
      cluster.fork();
    }

    stopSignals.forEach((signal) => {
      process.on(signal, () => {
        logger.info(`Got ${signal}, stopping workers...`);
        stopping = true;
        cluster.disconnect(() => {
          logger.info('All workers stopped, exiting.');
          process.exit(0);
        });
      });
    });
  }

  /**
   * Load service from NPM module
   *
   * @param {String} name
   * @returns {Service}
   */
  loadNpmModule(name) {
    const svc = require(name);
    return this.broker.createService(svc);
  }

  /**
   * Start Moleculer broker
   */
  startBroker() {
    this.worker = cluster.worker;

    if (this.worker) {
      Object.assign(this.config, {
        nodeID: `${this.config.nodeID || utils.getNodeID()}-${this.worker.id}`,
      });
    }

    // Create service broker
    this.broker = new ServiceBroker({ ...this.config });
    this.broker.runner = this;

    this.loadServices();

    if (this.watchFolders.length > 0) this.broker.runner.folders = this.watchFolders;

    return this.broker.start().then(() => {
      if (this.flags.repl && (!this.worker || this.worker.id === 1)) this.broker.repl();

      return this.broker;
    });
  }

  /**
   * Running
   */
  _run() {
    return Promise.resolve()
      .then(() => this.loadEnvFile())
      .then(() => this.loadConfigFile())
      .then(() => this.mergeOptions())
      .then(() =>
        mongoose.connect(process.env.MONGO_URI, {
          maxPoolSize: process.env.MAX_POOL_SIZE || 100,
          minPoolSize: process.env.MIN_POOL_SIZE || 25,
        })
      )
      .then(() => this.startBroker())
      .catch((err) => {
        logger.error(err);
        process.exit(1);
      });
  }

  restartBroker() {
    if (this.broker && this.broker.started) {
      return this.broker
        .stop()
        .catch((err) => {
          logger.error('Error while stopping ServiceBroker', err);
        })
        .then(() => this._run());
    }
    return this._run();
  }

  start(args) {
    return Promise.resolve()
      .then(() => this.processFlags(args))
      .then(() => {
        if (this.flags.instances !== undefined && cluster.isMaster) {
          return this.startWorkers(this.flags.instances);
        }

        return this._run();
      });
  }
}

module.exports = LeemonsRunner;
