import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@calendar/helpers/prefixPN';
import transformEvent from './transformEvent';

export default function useTransformEvent() {
  const [t, , , loading] = useTranslateLoader(prefixPN('transformEvent'));
  return [(event, calendars) => transformEvent(event, calendars, t), loading];
}
