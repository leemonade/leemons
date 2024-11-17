const ELEMENT_ID = "hot-loader";
const REMOVE_DELAY = 500;

let loaderContent = "";
let lastShown = new Date();

function showLoader() {
  let loader = document.getElementById(ELEMENT_ID);

  if (!loader) {
    loader = document.createElement("div");
    loader.id = ELEMENT_ID;
    loader.innerHTML = loaderContent;
    document.body.appendChild(loader);
  }
}

function hideLoader() {
  const loader = document.getElementById(ELEMENT_ID);

  if (loader && lastShown) {
    const remove = () => {
      document.body.removeChild(loader);
      loader.remove();
    };

    const elapsedTime = new Date().getTime() - lastShown.getTime();
    if (elapsedTime > REMOVE_DELAY) {
      remove();
    } else {
      setTimeout(remove, REMOVE_DELAY - elapsedTime);
    }
  }
}

function saveLoaderContent() {
  const loader = document.getElementById(ELEMENT_ID);
  if (loader) {
    loaderContent = loader.innerHTML;
  }
}

if (import.meta.hot) {
  saveLoaderContent();

  // Remove the first loader
  hideLoader();

  import.meta.hot.on("vite:beforeUpdate", () => {
    showLoader();
    lastShown = new Date();
  });

  import.meta.hot.on("vite:afterUpdate", () => {
    hideLoader();
  });
}
