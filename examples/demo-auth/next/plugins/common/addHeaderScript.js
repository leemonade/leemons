import { existHeaderScript } from './existHeaderScript';

export function addHeaderScript(url) {
  if (!existHeaderScript(url)) {
    const jsCode = document.createElement('script');
    jsCode.setAttribute('src', url);
    document.body.appendChild(jsCode);
  }
}
