/**
 *
 * @param {object[]} scores
 * @param {string} scores.user
 * @param {string} scores.activity,
 * @param {string} scores.grade
 * @param {string} scores.class
 */
export function setManualActivityScores(scores) {
  return leemons.api('v1/scores/manualActivities/scores', {
    method: 'PUT',
    body: scores,
  });
}
