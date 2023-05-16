const http = require('http');
const { getAvailablePort } = require('../lib/port');

describe('port Functions', () => {
  describe('call getAvailablePort', () => {
    test('with port in env', async (done) => {
      process.env.PORT = 9090;
      const port = await getAvailablePort();
      const server = http.createServer();
      server.listen(port, () => {
        server.close(() => {
          expect(port).toEqual(expect.any(Number));
          expect(port).toBeGreaterThanOrEqual(9090);
          done();
        });
      });

      server.on('error', (e) => {
        expect(e.code).not.toBe('EADDRINUSE');
        done();
      });

      process.env.PORT = '';
    });

    test('with port in env and given port', async (done) => {
      process.env.PORT = 7070;
      const port = await getAvailablePort(8080);
      const server = http.createServer();
      server.listen(port, () => {
        server.close(() => {
          expect(port).toEqual(expect.any(Number));
          expect(port).toBeGreaterThanOrEqual(8080);
          done();
        });
      });

      server.on('error', (e) => {
        expect(e.code).not.toBe('EADDRINUSE');
        done();
      });

      process.env.PORT = '';
    });

    test('with no port in env and no given port', async (done) => {
      const port = await getAvailablePort();
      const server = http.createServer();
      server.listen(port, () => {
        server.close(() => {
          expect(port).toEqual(expect.any(Number));
          expect(port).toBeGreaterThanOrEqual(8080);
          done();
        });
      });

      server.on('error', (e) => {
        expect(e.code).not.toBe('EADDRINUSE');
        done();
      });
    });

    test('with no port in env and given port', async (done) => {
      const port = await getAvailablePort(9090);
      const server = http.createServer();
      server.listen(port, () => {
        server.close(() => {
          expect(port).toEqual(expect.any(Number));
          expect(port).toBeGreaterThanOrEqual(9090);
          done();
        });
      });

      server.on('error', (e) => {
        expect(e.code).not.toBe('EADDRINUSE');
        done();
      });
    });
  });
});
