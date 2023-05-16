import { existHeaderStyle } from './existHeaderStyle';

export function addHeaderStyle(url) {
  if (!existHeaderStyle(url)) {
    const link = document.createElement('link');
    link.setAttribute('href', url);
    link.setAttribute('rel', 'stylesheet');
    document.body.appendChild(link);
  }
}
