function convertObjectToURLQuery(query) {
  return Object.entries(query)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}=${JSON.stringify(value)}`;
      }

      if (typeof value === 'boolean') {
        return `${key}=${value}`;
      }

      return null;
    })
    .filter(Boolean)
    .join('&');
}

export default async function getScores({ students, classes, gradedBy, periods, published } = {}) {
  const query = { students, classes, gradedBy, periods, published };

  try {
    const response = await leemons.api(`scores/scores?${convertObjectToURLQuery(query)}`, {
      method: 'GET',
    });

    return response?.scores;
  } catch (e) {
    throw new Error(e.error);
  }
}
