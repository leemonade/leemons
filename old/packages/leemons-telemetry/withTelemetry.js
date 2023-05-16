const apm = require('./index');

// Wrap some code inside a telemetry transaction
async function withTelemetry(name, parent, callback = () => {}) {
  const useParent = typeof parent !== 'function';

  const isGlobal = useParent && parent === 'global';
  const t = apm.startTransaction(name, useParent && !isGlobal ? parent : null);
  if (isGlobal && !global.appTransaction) {
    global.appTransaction = t;
  }

  try {
    const cb = useParent ? callback : parent;
    const result = await cb(t);
    t.end('success');
    return result;
  } catch (e) {
    apm.captureError(e);
    t.end('error');
    throw e;
  } finally {
    if (global.appTransaction === t) {
      global.appTransaction = null;
    }
  }
}

module.exports = withTelemetry;
