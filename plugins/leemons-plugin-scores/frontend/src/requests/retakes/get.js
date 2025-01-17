/**
 * Get the retakes of a class
 * @param {string} classId - The class id
 * @param {string} period - The period
 * @returns {Promise<object>} The retakes
 */
export async function getRetakes(retake) {
  const { data: retakes } = await leemons.api(
    `v1/scores/retakes/${retake.classId}/${retake.period}`,
    {
      method: 'GET',
    }
  );

  return retakes;
}
