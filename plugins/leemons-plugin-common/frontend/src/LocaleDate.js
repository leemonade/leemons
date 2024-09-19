import { useSession } from '@users/session';

const formatters = {};
const rFormatters = {};

export function getLocale(session) {
  return session ? session.locale : navigator?.language || 'en';
}

export function useLocale() {
  const session = useSession();
  return getLocale(session);
}

function getFormatterKey(locale, options) {
  return `${locale}-${JSON.stringify(options)}`;
}

export function LocaleDate({
  date,
  options = { year: 'numeric', month: '2-digit', day: '2-digit', type: '' },
}) {
  const session = useSession();
  const locale = getLocale(session);
  let formatOptions = options;

  const capitalize = (str) => str.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());

  if (options.type === 'agenda') {
    formatOptions = {
      ...options,
      year: undefined,
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    };
  }

  const key = getFormatterKey(locale, formatOptions);

  if (!formatters[key]) {
    formatters[key] = new Intl.DateTimeFormat([locale, 'default'], options);
  }
  const dateParts = formatters[key].formatToParts(new Date(date));

  if (options.type === 'agenda') {
    const dayPart = dateParts.find((part) => part.type === 'day').value;
    const monthPart = dateParts.find((part) => part.type === 'month').value;
    const weekdayPart = dateParts.find((part) => part.type === 'weekday').value;
    return capitalize(`${dayPart} ${monthPart}, ${weekdayPart}`);
  }

  return formatters[key].format(new Date(date));
}

function shortenUnits(label, short = false) {
  if (short) {
    return label.substring(0, 2).trim();
  }

  return label;
}

export function getLocaleDuration({ seconds: secondsProp, short = false, options = {} }, session) {
  const seconds = Number(secondsProp);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

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

  return [
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
}

function getNearestUnit(elapsedTime) {
  const units = {
    second: 1,
    minute: 60,
    hour: 60 * 60,
    day: 24 * 60 * 60,
    week: 24 * 60 * 60 * 7,
    month: 24 * 60 * 60 * 30,
    year: 24 * 60 * 60 * 365,
  };

  let unitToUse;

  Object.entries(units).forEach(([unit, seconds]) => {
    if (elapsedTime >= seconds) {
      unitToUse = unit;
    }
  });

  return { unit: unitToUse, seconds: units[unitToUse] };
}

export function LocaleRelativeTime({
  seconds,
  short = false,
  options = { numeric: 'always' },
  firstLetterUppercase = false,
}) {
  const locale = useLocale();
  const key = getFormatterKey(locale, { short, ...options });

  if (!rFormatters[key]) {
    rFormatters[key] = new Intl.RelativeTimeFormat([locale, 'default'], options);
  }

  const formatter = rFormatters[key];

  const unit = getNearestUnit(seconds);

  const result = formatter.format(Math.floor(seconds / unit.seconds), unit.unit);

  return firstLetterUppercase ? result.charAt(0).toUpperCase() + result.slice(1) : result;
}

export function LocaleDuration({ seconds: secondsProp, short = false, options = {} }) {
  const session = useSession();
  return getLocaleDuration({ seconds: secondsProp, short, options }, session);
}

export function LocaleWeekDay({ day }) {
  const session = useSession();

  if (!day) {
    return '';
  }

  const locale = getLocale(session);
  const key = getFormatterKey(locale, { weekday: 'long' });

  if (!formatters[key]) {
    formatters[key] = new Intl.DateTimeFormat([locale, 'default'], { weekday: 'long' });
  }
  // Create an arbitrary date that is a Monday
  // Leemons use Sunday as the first day of the week (day 0)
  const referenceDate = new Date(Date.UTC(2021, 0, 4)); // January 4 2021 is a Monday
  // Adjust the date to the desired day of the week
  const targetDate = new Date(referenceDate);
  targetDate.setUTCDate(referenceDate.getUTCDate() + day - 1);
  return formatters[key].format(targetDate);
}

/**
 * Get the locale format for a date
 * @param {string} locale - The locale to use
 * @returns {string} - The locale format
 */
export function getLocaleFormat(locale) {
  const testDate = new Date(2000, 0, 2); // January 2, 2000
  const formattedDate = new Intl.DateTimeFormat([locale, 'default']).format(testDate);

  const parts = formattedDate.split(/[/.-]/);

  if (parts.length !== 3) {
    return 'DD/MM/YYYY'; // Default format if parsing fails
  }

  const formatParts = [];
  parts.forEach((part) => {
    if (part.length === 4) {
      formatParts.push('YYYY');
    } else if (part === '01' || part === '1') {
      formatParts.push('MM');
    } else if (part === '02' || part === '2') {
      formatParts.push('DD');
    }
  });

  return formatParts.join('/');
}
