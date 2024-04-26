export default async function setScores({ scores, instances }) {
  try {
    await leemons.api(`v1/scores/scores`, {
      method: 'PATCH',
      body: { scores, instances },
    });

    return true;
  } catch (e) {
    throw new Error(e.message);
  }
}
