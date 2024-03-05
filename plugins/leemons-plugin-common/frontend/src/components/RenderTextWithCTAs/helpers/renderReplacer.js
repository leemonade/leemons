import { isString } from 'lodash';
import { renderLink } from './renderLink';

export function renderReplacer({ t, classes, cx, replacers, part, index }) {
  const key = part.substring(1, part.length - 1); // Extract key from placeholder
  const replacer = replacers[key];

  if (isString(replacer)) {
    return replacer;
  }

  switch (replacer?.type) {
    case 't':
      return t(replacer.value, replacers);
    case 'link':
    case 'linkT':
      return renderLink({ t, classes, cx, replacers, replacer, index });
    default:
      return part;
  }
}

export default renderReplacer;
