/**
 *
 * @param {object} query
 * @param {boolean} query.isTeacher
 * @param {number} [query.offset]
 * @param {number} [query.limit]
 * @param {string[]} [query.subjects]
 * @param {string[]} [query.programs]
 */
export default async function searchNyaActivities(query) {
  const result = await leemons.api(
    `assignables/activities/search/nya?${Object.entries(query)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`,
    {
      allAgents: true,
      method: 'GET',
    }
  );

  return result?.activities || [];
}
