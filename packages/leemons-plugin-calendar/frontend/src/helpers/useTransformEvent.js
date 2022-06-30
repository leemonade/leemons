import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@calendar/helpers/prefixPN';
import { useSession } from '@users/session';
import transformEvent from './transformEvent';

export default function useTransformEvent() {
  const session = useSession();
  const [t, , , loading] = useTranslateLoader(prefixPN('transformEvent'));
  return [(event, calendars) => transformEvent(event, calendars, { t, session }), loading];
}
