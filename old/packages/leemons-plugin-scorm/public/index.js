const CONTEXT = {
  scope: 'scorm',
  parent: 'parent',
  player: 'player',
};

const EVENTS = {
  loaded: 'loaded',
  initialData: 'initialData',
  commit: 'commit',
};

function sendMessage(msg) {
  window.parent.postMessage({ ...msg, scope: CONTEXT.scope, caller: CONTEXT.player }, '*');
}

function onSetValue() {
  const commit = window.API.renderCommitCMI(true);
  sendMessage({ event: EVENTS.commit, commit });
}

function emitScormLoadedEvent() {
  return setInterval(() => {
    sendMessage({ event: EVENTS.loaded });
  }, 100);
}

const intervalId = emitScormLoadedEvent();

function initializeScorm({ scormPackage, state, launchUrl }) {
  const { version: scormVersion } = scormPackage ?? {};

  const settings = {
    autoCommit: false,
  };

  // SCORM 2004
  if (scormVersion.indexOf(2004) > 0) {
    const scorm = new Scorm2004API(settings);
    window.API = scorm;
    window.API_1484_11 = scorm;
  }

  // SCORM 1.2
  else if (scormVersion.indexOf('scorm') > -1) {
    const scorm = new Scorm12API(settings);
    window.API = scorm;
  }

  if (state) {
    window.API.loadFromJSON(state, '');
  }

  window.API.on('SetValue.cmi.*', onSetValue);
  window.API.on('LMSSetValue.cmi.*', onSetValue);

  window.API.on('Initialize', () => sendMessage({ event: 'initialize' }));
  window.API.on('LMSInitialize', () => sendMessage({ event: 'initialize' }));

  window.API.on('Terminated', () => sendMessage({ event: 'terminate' }));
  window.API.on('LMSFinish', () => sendMessage({ event: 'terminate' }));

  const body = document.querySelector('body');
  body.innerHTML = `<iframe allow="*" src="${launchUrl}"></iframe>`;
}

function onMessage(msg) {
  switch (msg.event) {
    case EVENTS.initialData:
      clearInterval(intervalId);
      initializeScorm(msg);
      break;
    case EVENTS.commit:
      onSetValue();
      break;
    default:
  }
}

window.addEventListener('message', (event) => {
  const msg = event.data;
  if (msg?.scope === CONTEXT.scope && msg?.caller === CONTEXT.parent) {
    onMessage(msg);
  }
});
