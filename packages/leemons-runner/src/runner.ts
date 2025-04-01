import cluster from 'cluster';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { mongoose } from '@leemons/mongodb';
import Args from 'args';
import kleur from 'kleur';
import _ from 'lodash';
import { Service, ServiceBroker, Utils } from 'moleculer';

// Register Babel for JSX files
require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-react'],
  ignore: [
    (filename: string) => {
      // Ignore files inside node_modules
      if (filename.includes('/node_modules/')) {
        return true; // Ignore
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

interface Logger {
  info(message: string): void;
  error(err: Error | string): void;
}

/**
 * Logger helper
 */
const logger: Logger = {
  info(message: string) {
    console.log(kleur.grey('[Runner]'), kleur.green().bold(message));
  },
  error(err: Error | string) {
    if (err instanceof Error) {
      console.error(kleur.grey('[Runner]'), kleur.red().bold(err.message), err);
    } else {
      console.error(kleur.grey('[Runner]'), kleur.red().bold(err));
    }
  },
};

interface Flags {
  config?: string;
  repl?: boolean;
  hot?: boolean;
  silent?: boolean;
  env?: boolean;
  envfile?: string;
  instances?: number;
  mask?: string;
}

interface Dependency {
  name: string;
  path: string;
}

class LeemonsRunner {
  private watchFolders: string[];
  private flags: Flags | null;
  private configFile: any;
  private config: any;
  private servicePaths: string[] | null;
  private broker: ServiceBroker | null;
  private worker: any;

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
   * -c, --config     Load the configuration from a file
   * -e, --env        Load .env file from the current directory
   * -E, --envfile    Load a specified .env file
   * -h, --help       Output usage information
   * -H, --hot        Hot reload services if changed (disabled by default)
   * -i, --instances  Launch [number] instances node (load balanced)
   * -m, --mask       Filemask for service loading
   * -r, --repl       Start REPL mode (disabled by default)
   * -s, --silent     Silent mode. No logger (disabled by default)
   * -v, --version    Output the version number
   */
  processFlags(procArgs: string[]): void {
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
      mainColor: 'green',
      subColor: 'yellow',
    });

    this.servicePaths = Args.sub;
  }

  /**
   * Load environment variables from '.env' file
   */
  loadEnvFile(): void {
    if (this.flags?.env || this.flags?.envfile) {
      try {
        const dotenv = require('dotenv');

        if (this.flags.envfile) {
          dotenv.config({ path: this.flags.envfile });
        } else {
          dotenv.config();
        }
      } catch (e) {
        throw new Error(
          "The 'dotenv' package is missing! Please install it with 'npm install dotenv --save' command."
        );
      }
    }
  }

  /**
   * Fix Uppercase drive letter issue on Windows
   */
  fixDriveLetterCase(s: string): string {
    if (s && process.platform === 'win32' && s.match(/^[A-Z]:/g)) {
      return s.charAt(0).toLowerCase() + s.slice(1);
    }
    return s;
  }

  /**
   * Load configuration file
   */
  loadConfigFile(): Promise<any> {
    let filePath: string | null = null;
    // Env vars have priority over the flags
    const configPath = process.env.MOLECULER_CONFIG || this.flags?.config;

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
              if (Utils.isFunction(content)) {
                return content.call(this);
              }
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

    return Promise.resolve();
  }

  /**
   * Try to resolve a configuration file at a path
   */
  tryConfigPath(configPath: string, startFromCwd = false): string | null {
    let resolveOptions: { paths?: string[] } = {};
    if (startFromCwd) {
      resolveOptions = { paths: [process.cwd()] };
    }

    try {
      return require.resolve(configPath, resolveOptions);
    } catch (e) {
      return null;
    }
  }

  normalizeEnvValue(value: string): string | number | boolean {
    if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
      return value === 'true';
    }

    if (!Number.isNaN(Number(value))) {
      return Number(value);
    }

    return value;
  }

  overwriteFromEnv(obj: any, prefix?: string): any {
    Object.keys(obj).forEach((key) => {
      const envName = ((prefix ? `${prefix}_` : '') + key).toUpperCase();

      if (process.env[envName]) {
        obj[key] = this.normalizeEnvValue(process.env[envName] as string);
      }

      if (Utils.isPlainObject(obj[key])) {
        obj[key] = this.overwriteFromEnv(obj[key], (prefix ? `${prefix}_` : '') + key);
      }
    });

    // Process MOL_ env vars only at the root level
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
          obj = Utils.dotSet(
            obj,
            dotted,
            this.normalizeEnvValue(process.env[variable.key] as string)
          );
        });
    }

    return obj;
  }

  /**
   * Merge broker options
   */
  mergeOptions(): void {
    this.config = _.defaultsDeep(this.configFile, ServiceBroker.defaultOptions);
    this.config = this.overwriteFromEnv(this.config);
    this.config.errorHandler = (err: Error & { data?: { ignoreStack?: boolean } }, params: any) => {
      if (err?.data?.ignoreStack) {
        err.stack = '';
        delete err.data.ignoreStack;
      }

      if (params.event) {
        return { err, params };
      }

      throw err;
    };

    if (this.flags?.silent) {
      this.config.logger = false;
    }

    if (this.flags?.hot) {
      this.config.hotReload = true;
    }
  }

  /**
   * Check if the given path is a directory
   */
  isDirectory(p: string): boolean {
    try {
      return fs.lstatSync(p).isDirectory();
    } catch (e) {
      // ignore
    }
    return false;
  }

  /**
   * Check if the given path is a service file
   */
  isServiceFile(p: string): boolean {
    try {
      return !fs.lstatSync(p).isDirectory();
    } catch (e) {
      // ignore
    }
    return false;
  }

  getDependenciesFromNPM(): Dependency[] {
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

    const result: Dependency[] = [];
    _.forEach(dependencies, (dependency) => {
      try {
        if (dependency.startsWith('leemons-plugin-')) {
          result.push({
            name: dependency,
            path: require.resolve(`${dependency}/package.json`).replace('/package.json', ''),
          });
        }
      } catch (error) {
        logger.error(`Could not resolve dependency "${dependency}": ${error}`);
      }
    });

    console.log(result);

    return result;
  }

  /**
   * Load services from files or directories
   */
  loadServices(): void {
    this.watchFolders.length = 0;
    const fileMask = this.flags?.mask || '**/*.service.js';
    const dependencies = this.getDependenciesFromNPM();
    _.forEach(dependencies, (dependency) => {
      if (this.config.logger) {
        logger.info(`Loading service (${dependency.name}) from path ${dependency.path}`);
      }
      this.broker?.loadServices(dependency.path, fileMask);

      if (this.config.hotReload && !dependency.path.endsWith('frontend')) {
        this.watchFolders.push(dependency.path);
      }
    });
  }

  /**
   * Start cluster workers
   */
  startWorkers(instances?: number): void {
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

    // Default to number of CPU cores if instances is undefined or invalid
    const workerCount =
      instances && Number.isInteger(instances) && instances > 0 ? instances : os.cpus().length;

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
   */
  loadNpmModule(name: string): Service | undefined {
    try {
      const svc = require(name);
      return this.broker?.createService(svc);
    } catch (error) {
      logger.error(`Could not load service "${name}": ${error}`);
      return undefined;
    }
  }

  /**
   * Start Moleculer broker
   */
  async startBroker(): Promise<ServiceBroker> {
    this.worker = cluster.worker;

    if (this.worker) {
      Object.assign(this.config, {
        nodeID: `${this.config.nodeID || Utils.getNodeID()}-${this.worker.id}`,
      });
    }

    // Create service broker
    this.broker = new ServiceBroker({ ...this.config });
    (this.broker as any).runner = this;

    this.loadServices();

    if (this.watchFolders.length > 0) {
      (this.broker.runner as any).folders = this.watchFolders;
    }

    return this.broker.start().then(() => {
      if (this.flags?.repl && (!this.worker || this.worker.id === 1)) {
        this.broker?.repl();
      }

      return this.broker as ServiceBroker;
    });
  }

  /**
   * Running
   */
  private async _run(): Promise<ServiceBroker> {
    return Promise.resolve()
      .then(() => this.loadEnvFile())
      .then(() => this.loadConfigFile())
      .then(() => this.mergeOptions())
      .then(() =>
        mongoose.connect(process.env.MONGO_URI as string, {
          maxPoolSize: Number(process.env.MAX_POOL_SIZE) || 100,
          minPoolSize: Number(process.env.MIN_POOL_SIZE) || 25,
        })
      )
      .then(() => this.startBroker())
      .catch((err) => {
        logger.error(err);
        process.exit(1);
      });
  }

  async restartBroker(): Promise<ServiceBroker> {
    if (this.broker && this.broker.started) {
      return this.broker
        .stop()
        .catch((e) => {
          logger.error(`Error while stopping ServiceBroker: ${e.message ?? e}`);
        })
        .then(() => this._run());
    }
    return this._run();
  }

  async start(args: string[]): Promise<ServiceBroker> {
    this.processFlags(args);

    if (this.flags?.instances !== undefined && cluster.isPrimary) {
      this.startWorkers(this.flags.instances);
      // Master process should never resolve as it manages workers
      return new Promise((resolve) => {
        process.on('exit', () => resolve({} as ServiceBroker));
      });
    }

    return this._run();
  }
}

export default LeemonsRunner;
