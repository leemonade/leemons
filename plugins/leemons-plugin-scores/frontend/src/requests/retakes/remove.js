/**
 * Remove a retake from the database
 * @param {string} retakeId - The retake id
 * @returns {Promise<boolean>} Whether the retake was removed
 */
export async function removeRetake(retakeId) {
  const { deleted } = await leemons.api(`v1/scores/retakes/${retakeId}`, {
    method: 'DELETE',
  });

  return deleted;
}
