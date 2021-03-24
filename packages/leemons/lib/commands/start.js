const chalk = require('chalk');
const cluster = require('cluster');
// const execa = require('execa');
const fs = require('fs');
const http = require('http');
const ora = require('ora');
const path = require('path');
const request = require('request');
const detect = require('detect-port');

const leemons = require('../index');

function getAvailablePort(port = process.env.PORT || 8080) {
  return detect(port).then((_port) => _port);
}

function createWorker(env = {}) {
  const newWorker = cluster.fork(env);
  newWorker.process.env = env;
}

// Create a Proxy which uses the currently active server
async function createProxy(workers, log) {
  const server = http.createServer((req, res) => {
    const { url } = req;
    const serverUrl = Object.values(workers).find((worker) => worker.active).url;
    req.pipe(request({ url: `${serverUrl}${url}` })).pipe(res);
  });

  const port = await getAvailablePort();
  process.env.PORT = port;
  server.listen(port, () => {
    log(`Listening on http://localhost:${port}`);
  });
}

// Return a string with the time diff between 2 dates
function timeDif(start, end = new Date()) {
  const time = new Date(end - start);

  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();
  return `${(minutes ? `${minutes}min ` : '') + (seconds ? `${seconds}s ` : '')}${milliseconds}ms`;
}

// $ leemons develop
module.exports = async (args) => {
  const nextDir = path.resolve(process.cwd(), args.next || 'next/');
  if (!fs.existsSync(nextDir)) {
    process.stderr.write(chalk`{red The provided nextjs route is not valid}\n`);
    process.exit(1);
  }
  process.env.nextDir = nextDir;

  // Logging function
  const log = (...msgs) => {
    const time = new Date().toUTCString();
    const msg = msgs.join(' ');
    if (cluster.isMaster)
      process.stdout.write(
        chalk`{gray ${time}} {bold {gray [}{green Master}{gray ]}} {gray - ${msg}}\n`
      );
    else
      process.stdout.write(
        chalk`{gray ${time}} {bold {gray [}{blue Worker ${cluster.worker.process.pid}}{gray ]}} {gray - ${msg}}\n`
      );
  };
  global.log = log;

  // Master Cluster
  if (cluster.isMaster) {
    const workers = {};
    let nodeToBeKilled;
    let time;

    log(chalk`Started server on {underline PID: ${process.pid}}`);

    await createProxy(workers, log);

    // Register every new worker
    cluster.on('fork', async (worker) => {
      const { pid } = worker.process;
      workers[pid] = {
        pid,
        url: `http://localhost:${worker.process.env.PORT}`,
        active: true,
      };
    });

    // Remove every disconnected worker
    cluster.on('disconnect', (worker) => {
      const { pid } = worker.process;
      delete workers[pid];
    });

    // Handle message logic
    cluster.on('message', async (worker, message) => {
      const order = Array.isArray(message) ? message[0] : message;

      log(chalk`{blue Worker ${worker.process.pid}} sends {underline ${order}}`);

      switch (order) {
        // When a reload order is sent
        // Order worker to clean-exit
        // worker.send("kill");
        case 'reload':
          nodeToBeKilled = worker;
          time = new Date();
          createWorker({ PORT: await getAvailablePort() });
          break;
        // When a worker is ready to be killed
        // Kill it and create a new one
        case 'kill':
          log(chalk`Time to kill: {underline ${timeDif(time)}}`);
          worker.kill();
          break;
        // when a worker is running, kill the
        // node which have sended the reload order
        case 'running':
          if (nodeToBeKilled) {
            workers[nodeToBeKilled.process.pid].active = false;
            nodeToBeKilled.send('kill');
            nodeToBeKilled = undefined;
          }
          worker.send('running');
          break;
        case 'exit':
          if (message[1]) {
            process.stderr.write(chalk`{red An error ocurred\n{gray ${message[1]}}}\n`);
          }
          process.exit(1);
        // eslint-disable-next-line no-fallthrough
        default:
      }
    });

    // Create the first worker
    createWorker({ PORT: await getAvailablePort() });
  }
  // Worker Cluster
  if (cluster.isWorker) {
    const createdAt = new Date();

    // Set the port for the worker's server

    log('new Worker started');

    try {
      const spinner = ora('Building front').start();
      // TODO: uncomment this line
      // const { stdout } = await execa('npm', ['run', 'build', '--prefix', nextDir]);
      spinner.succeed();
      // log(stdout);

      const leemonsInstance = leemons(log);

      // Handle message logic
      cluster.worker.on('message', (message) => {
        log(chalk`{green Master} sends {underline ${message}}`);

        switch (message) {
          // When kill, do a clean-exit
          case 'kill':
            leemonsInstance.server.destroy(() => {
              log('Server stopped listening');
              process.send('kill');
              log(chalk.red.bold('is now death'));
            });
            break;
          // When running log the time to up
          case 'running':
            log(chalk`Time to up: {underline ${timeDif(createdAt)}}`);
            break;
          default:
        }
      });

      return leemonsInstance.start();
    } catch (error) {
      process.send(['exit', error.message]);
    }
  }
  return false;
};
