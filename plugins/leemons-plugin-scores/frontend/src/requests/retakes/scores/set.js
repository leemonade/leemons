/**
 * Set the score of a retake
 * @param {object} retake - The retake object
 * @param {string} retake.classId - The class id
 * @param {string} retake.period - The period
 * @param {string|null} retake.retakeId - The retake id
 * @param {string} retake.retakeIndex - The retake index
 * @param {string} retake.user - The user id
 * @param {number} retake.grade - The grade
 */
export async function setRetakeScore({ classId, period, ...retake }) {
  const { modified } = await leemons.api(`v1/scores/retakes/grades/${classId}/${period}`, {
    method: 'PUT',
    body: retake,
  });

  return modified;
}
