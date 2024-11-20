import { getLocaleFormat, useLocale } from '@common/LocaleDate';
import dayjs from 'dayjs';

import { useBlockingActivitiesStatus } from './useBlockingActivitiesStatus';

export function useActivityStates({ instance, user }) {
  const { dates = {}, alwaysAvailable = false, sendMail = false } = instance ?? {};
  const { start, closed } = dates;

  const { isBlocked } = useBlockingActivitiesStatus({ instance, user });

  const now = dayjs();
  const isClosed = closed && now.isAfter(closed);
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
