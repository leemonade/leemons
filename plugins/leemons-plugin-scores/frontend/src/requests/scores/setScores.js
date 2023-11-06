export default async function setScores(scores) {
  try {
    await leemons.api(`v1/scores/scores`, {
      method: 'PATCH',
      body: { scores },
    });

    return true;
  } catch (e) {
    throw new Error(e.error);
  }
}
