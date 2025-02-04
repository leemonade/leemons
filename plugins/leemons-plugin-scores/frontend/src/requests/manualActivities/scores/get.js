/**
 *
 * @param {string} classId
 * @returns
 */
export async function getManualActivityScores(classId) {
  const { data } = await leemons.api(`v1/scores/manualActivities/scores/class/${classId}`, {
    method: 'GET',
  });

  return data;
}
