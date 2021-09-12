export default async function addLevelSchema(_levelSchema) {
  const { status, levelSchema, error } = await leemons.api(
    `classroom/levelschema/${_levelSchema.id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(_levelSchema),
    }
  );

  if (status === 200) {
    return levelSchema;
  }
  throw new Error(error);
}
