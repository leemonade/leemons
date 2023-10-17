/**
 *
 * @param {object} query
 * @param {boolean} query.isTeacher
 * @param {number} [query.offset]
 * @param {number} [query.limit]
 * @param {string} [query.query]
 * @param {string} [query.role]
 * @param {string[]} [query.subjects]
 * @param {string[]} [query.programs]
 * @param {'open' | 'closed'} [query.status]
 * @param {'notStarted' | 'started' | 'finished' | 'notSubmitted' | 'evaluated'} [query.progress]
 * @param {boolean} [query.isArchived]
 * @param {'assignation' | 'start' | 'deadline'} [query.sort]
 */
export default async function searchOngoingActivities(query) {
  const result = await leemons.api(
    `assignables/activities/search/ongoing?${Object.entries(query)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`,
    {
      allAgents: true,
      method: 'GET',
    }
  );

  return result?.activities || [];
}
