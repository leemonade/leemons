/**
 * Add a retake to the database
 * @param {object} retake - The retake object
 * @param {string} retake.classId - The class id
 * @param {string} retake.period - The period
 * @returns {Promise<object>} The created retake
 */
export async function addRetake(retake) {
  const { data: createdRetake } = await leemons.api(
    `v1/scores/retakes/${retake.classId}/${retake.period}`,
    {
      method: 'POST',
    }
  );

  return createdRetake;
}
