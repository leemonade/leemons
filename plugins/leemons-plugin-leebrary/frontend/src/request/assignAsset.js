async function assignAsset({ assignable, instance }) {
  return leemons.api(`v1/leebrary/assignables/assign`, {
    allAgents: true,
    method: 'POST',

    body: {
      assignable,
      instance,
    },
  });
}

export default assignAsset;
