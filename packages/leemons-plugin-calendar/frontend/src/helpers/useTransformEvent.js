import useTranslateTitle from '@calendar/helpers/useTranslateTitle';
import transformEvent from './transformEvent';

export default function useTransformEvent() {
  const [translate, t, loading] = useTranslateTitle();
  return [(event, calendars) => transformEvent(event, calendars, { t, translate }), loading];
}
