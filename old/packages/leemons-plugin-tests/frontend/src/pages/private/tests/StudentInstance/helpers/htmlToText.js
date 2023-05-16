export function htmlToText(html) {
  const el = document.createElement('div');
  el.innerHTML = html;
  return el.innerText;
}
