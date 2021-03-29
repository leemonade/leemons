const fs = require('fs');
const cp = require('child_process');
const path = require('path');

const { getStackTrace } = require('leemons-utils');

const baseDir = process.env.PWD;
const nextPath = path.dirname(require.resolve('next/package.json'));
const leemonsDir = path.dirname(require.resolve('leemons/package.json'));
const jestWorker = path.dirname(require.resolve('jest-worker/package.json'));

function protectMethod(module, method, check, errormsg = `The method ${method} is private`) {
  const originalMethod = module[method];

  // eslint-disable-next-line no-param-reassign
  module[method] = (...args) => {
    const { path1, path2, result = true } = check(...args);
    if (result) {
      if (path1) {
        if (path2) {
          args.splice(0, 2);
          return originalMethod(path1, path2, ...args);
        }
        args.shift();
        return originalMethod(path1, ...args);
      }
      return originalMethod(...args);
    }

    if (typeof errormsg === 'function') {
      throw new Error(errormsg(method, ...args));
    }
    throw new Error(errormsg);
  };
}
function checkPath(userPath) {
  const caller = getStackTrace(3);
  const path1 = path.resolve(path.dirname(caller.fileName), userPath);

  // If the caller is a plugin, only let access the plugin folders
  if (global.leemons && global.leemons.plugins) {
    const plugin = Object.values(global.leemons.plugins).find((targetPlugin) =>
      caller.fileName.startsWith(targetPlugin.dir.app)
    );
    if (plugin) {
      return path1.startsWith(plugin.dir.app) ? { path1 } : { result: false };
    }
  }

  if (
    path1.startsWith(baseDir) ||
    caller.fileName.startsWith(path.join('internal', 'modules', 'cjs')) ||
    caller.fileName === __filename ||
    caller.fileName === 'fs.js' ||
    caller.fileName.startsWith(nextPath)
  ) {
    return { path1 };
  }
  return { result: false };
}
function error(method, path1) {
  return `The method ${method} is private for the path '${path1}'`;
}

function multiPathError(method, path1, path2) {
  return `The method ${method} is private for the path '${path1}' or '${path2}'`;
}

function cpCheck() {
  const caller = getStackTrace(3);
  const callerAlt = getStackTrace(4);
  if (caller.fileName.startsWith(jestWorker) || callerAlt.fileName.startsWith(leemonsDir)) {
    return { result: true };
  }
  return { result: false };
}

function cpError(method) {
  return `The method ${method} can't be used`;
}

function checkMultiPath(path1, path2) {
  const check1 = checkPath(path1);
  const check2 = checkPath(path2);
  if (check1 && check2) {
    return { ...check1, ...check2 };
  }
  return { result: false };
}
function protect() {
  // FS
  protectMethod(fs, 'writeFile', checkPath, error);
  protectMethod(fs, 'writeFileSync', checkPath, error);
  protectMethod(fs, 'readFile', checkPath, error);
  protectMethod(fs, 'readFileSync', checkPath, error);
  protectMethod(fs, 'copyFile', checkMultiPath, multiPathError);
  protectMethod(fs, 'copyFileSync', checkMultiPath, multiPathError);
  protectMethod(fs, 'open', checkPath, error);
  protectMethod(fs, 'openSync', checkPath, error);
  protectMethod(fs, 'rename', checkMultiPath, multiPathError);
  protectMethod(fs, 'renameSync', checkMultiPath, multiPathError);
  protectMethod(fs, 'exists', checkPath, error);
  protectMethod(fs, 'existsSync', checkPath, error);
  protectMethod(fs, 'access', checkPath, error);
  protectMethod(fs, 'accessSync', checkPath, error);
  protectMethod(fs, 'chown', checkPath, error);
  protectMethod(fs, 'chownSync', checkPath, error);
  protectMethod(fs, 'chown', checkPath, error);
  protectMethod(fs, 'chownSync', checkPath, error);
  protectMethod(fs, 'chmod', checkPath, error);
  protectMethod(fs, 'chmodSync', checkPath, error);
  protectMethod(fs, 'lchown', checkPath, error);
  protectMethod(fs, 'lchownSync', checkPath, error);
  protectMethod(fs, 'link', checkMultiPath, multiPathError);
  protectMethod(fs, 'linkSync', checkMultiPath, multiPathError);
  protectMethod(fs, 'lstat', checkPath, error);
  protectMethod(fs, 'lstatSync', checkPath, error);
  protectMethod(fs, 'mkdir', checkPath, error);
  protectMethod(fs, 'mkdirSync', checkPath, error);
  protectMethod(fs, 'mkdtemp', checkPath, error);
  protectMethod(fs, 'mkdtempSync', checkPath, error);
  protectMethod(fs, 'opendir', checkPath, error);
  protectMethod(fs, 'opendirSync', checkPath, error);
  protectMethod(fs, 'readdir', checkPath, error);
  protectMethod(fs, 'readdirSync', checkPath, error);
  protectMethod(fs, 'readdirSync', checkPath, error);
  protectMethod(fs, 'readlink', checkPath, error);
  protectMethod(fs, 'readlinkSync', checkPath, error);
  protectMethod(fs, 'realpath', checkPath, error);
  protectMethod(fs, 'realpathSync', checkPath, error);
  protectMethod(fs, 'rmdir', checkPath, error);
  protectMethod(fs, 'rmdirSync', checkPath, error);
  protectMethod(fs, 'stat', checkPath, error);
  protectMethod(fs, 'statSync', checkPath, error);
  protectMethod(fs, 'symlink', checkPath, error);
  protectMethod(fs, 'symlinkSync', checkPath, error);
  protectMethod(fs, 'unwatchFile', checkPath, error);
  protectMethod(fs, 'unlink', checkPath, error);
  protectMethod(fs, 'unlinkSync', checkPath, error);
  protectMethod(fs, 'utimes', checkPath, error);
  protectMethod(fs, 'utimesSync', checkPath, error);
  protectMethod(fs, 'watch', checkPath, error);
  protectMethod(fs, 'watchFile', checkPath, error);

  // child_process
  protectMethod(cp, 'spawn', cpCheck, cpError);
  protectMethod(cp, 'spawnSync', cpCheck, cpError);
  protectMethod(cp, 'exec', cpCheck, cpError);
  protectMethod(cp, 'execSync', cpCheck, cpError);
  protectMethod(cp, 'execFile', cpCheck, cpError);
  protectMethod(cp, 'execFileSync', cpCheck, cpError);
  protectMethod(cp, 'fork', cpCheck, cpError);
}

module.exports = protect;
