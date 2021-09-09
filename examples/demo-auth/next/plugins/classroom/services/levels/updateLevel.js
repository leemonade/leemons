export default async function addLevel(_level) {
  const { status, level, error } = await leemons.api(`classroom/level/${_level.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(_level),
  });

  if (status === 200) {
    return level;
  }
  throw new Error(error);
}
