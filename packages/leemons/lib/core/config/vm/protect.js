const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const _ = require('lodash');

// Generate an array with the protected method [name, function]
function protectMethod(module, method, check, errormsg = `The method ${method} is private`) {
  const originalMethod = module[method];

  return [
    method,
    (...args) => {
      // Runs the check we gave
      const { path1, path2, result = true } = check(...args);
      // If we have a result not false
      if (result) {
        // And the path1 exists
        if (path1) {
          // If there is a second path, use it
          if (path2) {
            args.splice(0, 2);
            return originalMethod(path1, path2, ...args);
          }
          // Else use only the first one
          args.shift();
          return originalMethod(path1, ...args);
        }
        return originalMethod(...args);
      }

      // If an error occurred, throw with the given error
      if (typeof errormsg === 'function') {
        throw new Error(errormsg(method, ...args));
      }
      throw new Error(errormsg);
    },
  ];
}

// Generate a FS allowing the operations inside the given path
module.exports = (allowedRelPath, plugin, type) => {
  // EN: Do not protect fs method for the core plugins that need full access
  // ES: Para aquellos plugins core que necesiten acceso total, dejar de proteger el fs
  if (
    type === 'plugin' &&
    ['bulk-template', 'leebrary', 'admin'].includes(plugin.name)
    // || type === 'provider' && [].includes(plugin.name)
  ) {
    return () => ({ fs, 'fs/promises': fsPromises });
  }

  // Generate an absolute path for the allowed directory
  const allowedPath = path.isAbsolute(allowedRelPath)
    ? allowedRelPath
    : path.resolve(allowedRelPath);

  // The one path checking function
  function checkPath(userPath) {
    // Get the absolute path used
    const path1 = path.resolve(allowedPath, userPath);

    // If the path is inside the allowed directory, return true
    if (path1.startsWith(allowedPath)) {
      return { path1 };
    }
    // else return false
    return { result: false };
  }

  // The 2 path checking function
  function checkMultiPath(path1, path2) {
    // run one path checking function with path 1
    const { result: check1 = true } = checkPath(path1);
    // The same with path 2
    const { result: check2 = true } = checkPath(path2);

    // If both are valid return true
    if (check1 && check2) {
      return { ...check1, ...check2 };
    }
    return { result: false };
  }

  // Generate a custom error for 1-path
  function error(method, path1) {
    return `The method ${method} is private for the path '${path1}'`;
  }

  // Generate a custom error for 2-path
  function multiPathError(method, path1, path2) {
    return `The method ${method} is private for the path '${path1}' or '${path2}'`;
  }

  // Protect the given methods
  function protect() {
    // FS
    return {
      fs: _.fromPairs([
        ['close', fs.close],
        ['closeSync', fs.closeSync],
        ['constants', fs.constants],
        ['read', fs.read],
        ['readSync', fs.readSync],
        ['write', fs.write],
        ['writeSync', fs.writeSync],

        ...[
          { method: 'access' },
          { method: 'accessSync' },
          { method: 'appendFile' },
          { method: 'appendFileSyn' },
          { method: 'chmod' },
          { method: 'chmodSync' },
          { method: 'chown' },
          { method: 'chownSync' },
          { method: 'createReadStream' },
          { method: 'createWriteStream' },
          { method: 'exists' },
          { method: 'existsSync' },
          { method: 'lchmod' },
          { method: 'lchmodSync' },
          { method: 'lchown' },
          { method: 'lchownSync' },
          { method: 'lutimes' },
          { method: 'lstat' },
          { method: 'lstatSync' },
          { method: 'mkdir' },
          { method: 'mkdirSync' },
          { method: 'readdir' },
          { method: 'readdirSync' },
          { method: 'readFile' },
          { method: 'readFileSync' },
          { method: 'readlink' },
          { method: 'readlinkSync' },
          { method: 'realpath' },
          { method: 'realpathSync' },
          { method: 'open' },
          { method: 'openSync' },
          { method: 'opendir' },
          { method: 'opendirSync' },
          { method: 'readlink' },
          { method: 'readlinkSync' },
          { method: 'rmdir' },
          { method: 'rmdirSync' },
          { method: 'rm' },
          { method: 'rmsync' },

          { method: 'stat' },
          { method: 'statSync' },
          { method: 'symlink' },
          { method: 'symlinkSync' },
          { method: 'truncate' },
          { method: 'truncateSync' },
          { method: 'unlink' },
          { method: 'unlinkSync' },
          { method: 'unwatchFile' },
          { method: 'utimes' },
          { method: 'utimesSync' },
          { method: 'watch' },
          { method: 'watchFile' },
          { method: 'writeFile' },
          { method: 'writeFileSync' },

          { method: 'copyFile', isMultiPath: true },
          { method: 'copyFileSync', isMultiPath: true },
          { method: 'cp', isMultiPath: true },
          { method: 'cpSync', isMultiPath: true },
          { method: 'link', isMultiPath: true },
          { method: 'linkSync', isMultiPath: true },
          { method: 'rename', isMultiPath: true },
          { method: 'renameSync', isMultiPath: true },
        ].map(({ method, isMultiPath = false }) =>
          protectMethod(
            fs,
            method,
            isMultiPath ? checkMultiPath : checkPath,
            isMultiPath ? multiPathError : error
          )
        ),
      ]),
      'fs/promises': _.fromPairs([
        ...[
          { method: 'access' },
          { method: 'appendFile' },
          { method: 'chmod' },
          { method: 'chown' },
          { method: 'lchmod' },
          { method: 'lchown' },
          { method: 'lstat' },
          { method: 'mkdir' },
          { method: 'open' },
          { method: 'opendir' },
          { method: 'readdir' },
          { method: 'readFile' },
          { method: 'readlink' },
          { method: 'realpath' },
          { method: 'rmdir' },
          { method: 'rm' },
          { method: 'stat' },
          { method: 'truncate' },
          { method: 'unlink' },
          { method: 'utimes' },
          { method: 'watch' },
          { method: 'writeFile' },

          { method: 'copyFile', isMultiPath: true },
          { method: 'cp', isMultiPath: true },
          { method: 'link', isMultiPath: true },
          { method: 'rename', isMultiPath: true },
          { method: 'symlink', isMultiPath: true },
        ].map(({ method, isMultiPath = false }) =>
          protectMethod(
            fsPromises,
            method,
            isMultiPath ? checkMultiPath : checkPath,
            isMultiPath ? multiPathError : error
          )
        ),
      ]),
    };
  }

  // return the protection generator for the given directory
  return protect;
};
