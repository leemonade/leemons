export function existHeaderScript(url) {
  const scripts = document.getElementsByTagName('script');
  for (let i = 0, l = scripts.length; i < l; i++) {
    if (scripts[i].src === url) return true;
  }
}
