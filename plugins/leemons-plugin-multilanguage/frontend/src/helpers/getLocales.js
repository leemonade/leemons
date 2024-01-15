import useSWR from 'swr';

export async function getLocales(callback = () => {}) {
  const fetchedLocales = (
    await fetch(`${leemons.apiUrl}/api/v1/multilanguage/locales`).then((r) => r.json())
  ).locales;

  if (fetchedLocales) {
    callback(fetchedLocales);
  }

  return fetchedLocales;
}

export function useGetLocales(callback) {
  return useSWR('getLocales', () => getLocales(callback));
}
