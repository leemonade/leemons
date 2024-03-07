async function addStatement(statement) {
  return leemons.api(`v1/xapi/xapi/add/statement`, {
    allAgents: true,
    method: 'POST',
    body: statement,
  });
}

export default addStatement;
