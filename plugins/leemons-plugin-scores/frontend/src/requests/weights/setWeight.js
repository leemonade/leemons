export default async function setWeight({ class: classId, weight }) {
  const { weight: newWeight } = await leemons.api(`v1/scores/weights`, {
    method: 'PUT',
    body: { class: classId, weight },
  });

  return newWeight;
}
