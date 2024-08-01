const ELEMENT_ID = 'hot-loader';

let loaderShown = 1;
let loaderContent = '';

function showLoader() {
  let loader = document.getElementById(ELEMENT_ID);

  if (!loader) {
    loader = document.createElement('div');
    loader.id = ELEMENT_ID;
    loader.innerHTML = loaderContent;

    document.body.appendChild(loader);
  }

  loaderShown++;
}

function hideLoader() {
  const loader = document.getElementById(ELEMENT_ID);

  if (loader && loaderShown > 0) {
    loaderShown--;
  }

  if (loaderShown === 0) {
    loaderContent = loader.innerHTML;
    document.body.removeChild(loader);
    loader.remove();
  }
}

if (module.hot) {
  // Remove the first loader
  hideLoader();

  // EN: Connect to Hot Module Replacement WebSocket server.
  // ES: Conectarse al servidor WebSocket de Hot Module Replacement.
  const { hostname } = window.location;
  const url = `ws://${hostname}:3000/ws`;

  const ws = new WebSocket(url);
  let isFirstRender = true;

  ws.onopen = () => {
    console.debug('[Leemons HMR] Connected to Hot Module Replacement server.');
  };

  ws.onmessage = (event) => {
    let message;
    try {
      message = JSON.parse(event.data);
    } catch (e) {
      message = event.data;
    }

    if (!isFirstRender && message?.type === 'invalid') {
      console.error('[Leemons HMR] Content has changed.');
      showLoader();
    }

    module.hot.addStatusHandler((status) => {
      if (status === 'idle' && loaderShown) {
        hideLoader();
      }
    });

    // EN: Only change firstRender if type is 'hash'
    // ES: Solo cambiar firstRender si el tipo es 'hash'
    if (isFirstRender && message.type === 'hash') {
      isFirstRender = false;
    }
  };

  ws.onerror = (event) => {
    console.error('[Leemons HMR] Error:', event);
  };
}
