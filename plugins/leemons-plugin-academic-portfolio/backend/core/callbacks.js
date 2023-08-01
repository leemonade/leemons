const callbacks = {
  beforeRemoveProgram: [],
  afterRemoveProgram: [],
};

async function sendCallbacks(type, { ...params }) {
  for (let i = 0, l = callbacks[type].length; i < l; i++) {
    // eslint-disable-next-line no-await-in-loop
    await callbacks[type][i](...params);
  }
}
function onCallback(type, callback) {
  if (callbacks[type].indexOf(callback) < 0) {
    callbacks[type].push(callback);
  }
}
function offCallback(type, callback) {
  const index = callbacks[type].indexOf(callback);
  if (index >= 0) {
    callbacks[type].splice(index, 1);
  }
}

module.exports = {
  onBeforeRemoveProgram: (callback) => onCallback('beforeRemoveProgram', callback),
  offBeforeRemoveProgram: (callback) => offCallback('beforeRemoveProgram', callback),
  sendBeforeRemoveProgramCallbacks: (...params) => sendCallbacks('beforeRemoveProgram', params),
  onAfterRemoveProgram: (callback) => onCallback('afterRemoveProgram', callback),
  offAfterRemoveProgram: (callback) => offCallback('afterRemoveProgram', callback),
  sendAfterRemoveProgramCallbacks: (...params) => sendCallbacks('afterRemoveProgram', params),
};
