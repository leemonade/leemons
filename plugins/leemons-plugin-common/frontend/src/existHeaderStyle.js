export function existHeaderStyle(url) {
  const links = document.getElementsByTagName('link');
  for (let i = 0, l = links.length; i < l; i++) {
    if (links[i].href === url) return true;
  }
}
