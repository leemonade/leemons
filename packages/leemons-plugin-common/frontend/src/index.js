import formWithTheme from './formWithTheme';
import getObjectArrayKeys from './getObjectArrayKeys';
import regex from './regex';
import unflatten from './unflatten';
import useRequestErrorMessage, { getRequestErrorMessage } from './useRequestErrorMessage';

export * from './addHeaderScript';
export * from './addHeaderStyle';
export * from './existHeaderScript';
export * from './existHeaderStyle';
export * from './useAsync';
export * from './useApi';
export * from './userImage';
export * from './useStore';
export * from './useQuery';
export * from './useSearchParams';
export * from './tags';
export * from './LocaleDate';
export * from './numberToEncodedLetter';
export * from './linkify';
export * from './isValidHttpUrl';
export * from './randomString';
export * from './useCache';
export * from './stringMatch';
export * from './components';
export * from './ellipsis';
export * from './useIdle';
export * from './useBeforeUnload';
export * from './context';
export * from './share';
export * from './hashObject';

function htmlToText(html) {
  const el = document.createElement('div');
  el.innerHTML = html;
  return el.innerText;
}

export {
  formWithTheme,
  getObjectArrayKeys,
  regex,
  unflatten,
  useRequestErrorMessage,
  getRequestErrorMessage,
  htmlToText,
};
