import { isString } from 'lodash';
import { renderLink } from './renderLink';
import { renderAction } from './renderAction';

export function renderReplacer({ t, classes, cx, replacers, part, index }) {
  const key = part.substring(1, part.length - 1); // Extract key from placeholder
  const replacer = replacers[key];

  if (isString(replacer)) {
    return replacer;
  }

  switch (replacer?.type) {
    case 't':
      return t(replacer.value, replacers);
    case 'action':
    case 'actionT':
      return renderAction({ t, classes, cx, replacers, replacer, index });
    case 'link':
    case 'linkT':
      return renderLink({ t, classes, cx, replacers, replacer, index });
    default:
      return part;
  }
}

export default renderReplacer;
