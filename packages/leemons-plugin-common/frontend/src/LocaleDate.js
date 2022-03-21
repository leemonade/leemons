import { useSession } from '@users/session';

const formatters = {};

function getLocale(session) {
  return session ? session.locale : navigator?.language || 'en';
}

function getFormatterKey(locale, options) {
  return `${locale}-${JSON.stringify(options)}`;
}

// eslint-disable-next-line import/prefer-default-export
export function LocaleDate({ date, options = {} }) {
  const session = useSession();
  const locale = getLocale(session);
  const key = getFormatterKey(locale, options);

  if (!formatters[key]) {
    formatters[key] = new Intl.DateTimeFormat([locale, 'default'], options);
  }

  return formatters[key].format(new Date(date));
}
