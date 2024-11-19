import { getLocaleFormat, useLocale } from '@common/LocaleDate';
import dayjs from 'dayjs';

export function useActivityStates({ instance }) {
  const { dates = {}, alwaysAvailable = false, sendMail = false } = instance ?? {};
  const { start, closed } = dates;

  const now = dayjs();
  const isClosed = closed && now.isAfter(closed);
  const isBlocked = false;
  const isScheduled = !isClosed && !alwaysAvailable && start && now.isBefore(start);

  const locale = useLocale();
  const localeFormat = getLocaleFormat(locale);

  return {
    isScheduled,
    isClosed,
    isAlwaysAvailable: alwaysAvailable,
    isBlocked,
    isUnavailable: isBlocked || isScheduled,

    date: dayjs(start).format(localeFormat),
    time: dayjs(start).format('HH:mm'),

    sendMail,
  };
}
