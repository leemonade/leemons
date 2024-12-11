/**
 * Creates a manual activity
 * @param {object} manualActivity
 * @param {string} manualActivity.name - The name of the activity
 * @param {string} manualActivity.description - The description of the activity
 * @param {string} manualActivity.date - The date of the activity in ISO format
 * @param {string} manualActivity.type - The type of activity (task, test, etc)
 * @param {string} manualActivity.classId - The class ID in LRN format
 */
export async function createManualActivity(manualActivity) {
  const { id } = await leemons.api('v1/scores/manualActivities', {
    method: 'POST',
    body: { manualActivity },
  });

  return id;
}
