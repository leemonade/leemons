import { useSession } from '@users/session';

const formatters = {};
const rFormatters = {};

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

function shortenUnits(label, short = false) {
  if (short) {
    return label.substring(0, 2).trim();
  }

  return label;
}

export function LocaleDuration({ seconds: secondsProp, short = false, options = {} }) {
  const seconds = Number(secondsProp);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const session = useSession();
  const locale = getLocale(session);
  const key = getFormatterKey(locale, options);

  if (!rFormatters[key]) {
    rFormatters[key] = new Intl.RelativeTimeFormat([locale, 'default'], options);
  }

  const formatter = rFormatters[key];

  const secondParts = formatter.formatToParts(s, 'seconds');
  const minuteParts = formatter.formatToParts(m, 'minutes');
  const hourParts = formatter.formatToParts(h, 'hours');
  const dayParts = formatter.formatToParts(d, 'days');

  const result = [
    { value: d, label: shortenUnits(dayParts.slice(-1)[0].value, short) },
    { value: h, label: shortenUnits(hourParts.slice(-1)[0].value, short) },
    {
      value: m,
      label: shortenUnits(minuteParts.slice(-1)[0].value, short),
    },
    {
      value: s,
      label: shortenUnits(secondParts.slice(-1)[0].value, short),
    },
  ]
    .filter((item) => item.value > 0)
    .map((item) => item.value + item.label)
    .join(' ');

  return result;
}
