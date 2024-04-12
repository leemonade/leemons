export default async function getWeights({ classes: _classes }) {
  const classesIds = Array.isArray(_classes) ? _classes : [_classes];

  const { weights } = await leemons.api(
    `v1/scores/weights?classes=${classesIds.join('&classes=')}`,
    {
      method: 'GET',
    }
  );

  return weights;
}
