const serveHandler = require('serve-handler');
const http = require('http');
const os = require('os');
const chalk = require('chalk');
const boxen = require('boxen');
const getBuildDir = require('../src/paths/getBuildDir');

const { isTTY } = process.stdout;
const interfaces = os.networkInterfaces();
const httpMode = 'http';

function getNetworkAddress() {
  for (let i = 0; i < interfaces.length; i++) {
    const iface = interfaces[i];
    for (let j = 0; j < iface.length; j++) {
      const { address, family, internal } = iface[j];
      if (family === 'IPv4' && !internal) {
        return address;
      }
    }
  }

  return null;
}

const registerShutdown = (fn) => {
  let run = false;

  const wrapper = () => {
    if (!run) {
      run = true;
      fn();
    }
  };

  process.on('SIGINT', wrapper);
  process.on('SIGTERM', wrapper);
  process.on('exit', wrapper);
};

const info = (message) => chalk`{magenta [INFO]} ${message}`;
const warning = (message) => chalk`{yellow [WARNING]} ${message}`;
const error = (message) => chalk`{red [ERROR]} ${message}`;

module.exports = async function preview({ build, port }) {
  const buildDir = getBuildDir(build);

  const server = http.createServer((req, res) => {
    serveHandler(req, res, {
      public: buildDir,
      // directoryListing: true,
      etag: true,
      rewrites: [
        {
          source: '**',
          destination: '/index.html',
        },
      ],
      trailingSlash: false,
    });
  });

  server.listen(port, () => {
    const details = server.address();

    let localAddress = null;
    let networkAddress = null;

    if (typeof details === 'string') {
      localAddress = details;
    } else if (typeof details === 'object' && details.port) {
      const address = details.address === '::' ? 'localhost' : details.address;
      const ip = getNetworkAddress();

      localAddress = `${httpMode}://${address}:${details.port}`;
      networkAddress = ip ? `${httpMode}://${ip}:${details.port}` : null;
    }

    if (isTTY) {
      let message = chalk.green('Serving!');

      if (localAddress) {
        const prefix = networkAddress ? '- ' : '';
        const space = networkAddress ? '            ' : '  ';

        message += `\n\n${chalk.bold(`${prefix}Local:`)}${space}${localAddress}`;
      }

      if (networkAddress) {
        message += `\n${chalk.bold('- On Your Network:')}  ${networkAddress}`;
      }

      console.log(
        boxen(message, {
          padding: 1,
          borderColor: 'green',
          margin: 1,
        })
      );
    } else {
      const suffix = localAddress ? ` at ${localAddress}` : '';
      console.log(info(`Accepting connections${suffix}`));
    }
  });

  registerShutdown(() => {
    console.log(`\n${info('Gracefully shutting down. Please wait...')}`);

    server.close((err) => {
      if (err) {
        console.error(error(`Error shutting down: ${err.message}`));
      }
    });

    process.on('SIGINT', () => {
      console.log(`\n${warning('Force-closing all open sockets...')}`);
      process.exit(0);
    });
  });
};
