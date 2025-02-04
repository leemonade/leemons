/**
 * Get the scores of a retake
 * @param {object} query - The retake object
 * @param {string} query.classId - The class id
 * @param {string} query.period - The period
 * @param {string|null} query.retakeId - The retake id
 * @param {string} query.retakeIndex - The retake index
 * @param {string} query.user - The user id
 * @param {number} query.grade - The grade
 */
export async function getRetakeScores({ classId, period, ...query }) {
  const URLParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    URLParams.set(key, value);
  });

  const { data: scores } = await leemons.api(
    `v1/scores/retakes/grades/${classId}/${period}?${URLParams.toString()}`,
    {
      method: 'GET',
    }
  );

  return scores;
}
