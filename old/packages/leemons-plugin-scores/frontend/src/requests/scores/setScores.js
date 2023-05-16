export default async function setScores(scores) {
  try {
    await leemons.api(`scores/scores`, {
      method: 'PATCH',
      body: { scores },
    });

    return true;
  } catch (e) {
    throw new Error(e.error);
  }
}
