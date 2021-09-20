export default async function addLevelSchema(_levelSchema) {
  const { status, levelSchema, error } = await leemons.api('classroom/levelschema', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(_levelSchema),
  });

  if (status === 201) {
    return levelSchema;
  }
  throw new Error(error);
}
