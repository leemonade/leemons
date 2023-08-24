async function addStatement(statement) {
  return leemons.api(`xapi/add/statement`, {
    allAgents: true,
    method: 'POST',
    body: statement,
  });
}

export default addStatement;
