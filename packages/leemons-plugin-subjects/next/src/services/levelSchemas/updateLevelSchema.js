export default async function updateLevelSchema(_levelSchema) {
  const { status, levelSchema, error } = await leemons.api(
    {
      url: `classroom/levelschema/${_levelSchema.id}`,
      allAgents: true,
    },
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
