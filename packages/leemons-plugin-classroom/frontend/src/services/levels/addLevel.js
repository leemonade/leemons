export default async function addLevel(_level) {
  const { status, level, error } = await leemons.api('classroom/level', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(_level),
  });

  if (status === 201) {
    return level;
  }
  throw new Error(error);
}
