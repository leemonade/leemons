const fs = require('fs');
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
module.exports = (allowedRelPath) => {
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
    return _.fromPairs([
      protectMethod(fs, 'writeFile', checkPath, error),
      protectMethod(fs, 'writeFileSync', checkPath, error),
      protectMethod(fs, 'readFile', checkPath, error),
      protectMethod(fs, 'readFileSync', checkPath, error),
      protectMethod(fs, 'copyFile', checkMultiPath, multiPathError),
      protectMethod(fs, 'copyFileSync', checkMultiPath, multiPathError),
      protectMethod(fs, 'open', checkPath, error),
      protectMethod(fs, 'openSync', checkPath, error),
      protectMethod(fs, 'rename', checkMultiPath, multiPathError),
      protectMethod(fs, 'renameSync', checkMultiPath, multiPathError),
      protectMethod(fs, 'exists', checkPath, error),
      protectMethod(fs, 'existsSync', checkPath, error),
      protectMethod(fs, 'access', checkPath, error),
      protectMethod(fs, 'accessSync', checkPath, error),
      protectMethod(fs, 'chown', checkPath, error),
      protectMethod(fs, 'chownSync', checkPath, error),
      protectMethod(fs, 'chown', checkPath, error),
      protectMethod(fs, 'chownSync', checkPath, error),
      protectMethod(fs, 'chmod', checkPath, error),
      protectMethod(fs, 'chmodSync', checkPath, error),
      protectMethod(fs, 'lchown', checkPath, error),
      protectMethod(fs, 'lchownSync', checkPath, error),
      protectMethod(fs, 'link', checkMultiPath, multiPathError),
      protectMethod(fs, 'linkSync', checkMultiPath, multiPathError),
      protectMethod(fs, 'lstat', checkPath, error),
      protectMethod(fs, 'lstatSync', checkPath, error),
      protectMethod(fs, 'mkdir', checkPath, error),
      protectMethod(fs, 'mkdirSync', checkPath, error),
      protectMethod(fs, 'mkdtemp', checkPath, error),
      protectMethod(fs, 'mkdtempSync', checkPath, error),
      protectMethod(fs, 'opendir', checkPath, error),
      protectMethod(fs, 'opendirSync', checkPath, error),
      protectMethod(fs, 'readdir', checkPath, error),
      protectMethod(fs, 'readdirSync', checkPath, error),
      protectMethod(fs, 'readdirSync', checkPath, error),
      protectMethod(fs, 'readlink', checkPath, error),
      protectMethod(fs, 'readlinkSync', checkPath, error),
      protectMethod(fs, 'realpath', checkPath, error),
      protectMethod(fs, 'realpathSync', checkPath, error),
      protectMethod(fs, 'rmdir', checkPath, error),
      protectMethod(fs, 'rmdirSync', checkPath, error),
      protectMethod(fs, 'stat', checkPath, error),
      protectMethod(fs, 'statSync', checkPath, error),
      protectMethod(fs, 'symlink', checkPath, error),
      protectMethod(fs, 'symlinkSync', checkPath, error),
      protectMethod(fs, 'unwatchFile', checkPath, error),
      protectMethod(fs, 'unlink', checkPath, error),
      protectMethod(fs, 'unlinkSync', checkPath, error),
      protectMethod(fs, 'utimes', checkPath, error),
      protectMethod(fs, 'utimesSync', checkPath, error),
      protectMethod(fs, 'watch', checkPath, error),
      protectMethod(fs, 'watchFile', checkPath, error),
    ]);
  }

  // return the protection generator for the given directory
  return protect;
};
