const cluster = require('cluster');

/**
 * Creates a new Worker (thread) running a copy of the current process
 * You can set a custom environment for the new worker
 * @param {*} env The new thread environment
 * @returns The invoked worker
 */
function createWorker(env = {}) {
  const newWorker = cluster.fork(env);
  return newWorker;
}

module.exports = { createWorker };
