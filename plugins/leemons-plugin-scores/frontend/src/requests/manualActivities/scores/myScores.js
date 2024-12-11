/**
 *
 * @param {string} classId
 * @returns
 */
export async function getMyManualActivityScores(classId) {
  const { data } = await leemons.api(`v1/scores/manualActivities/scores/class/${classId}/user/me`, {
    method: 'GET',
  });

  return data;
}
