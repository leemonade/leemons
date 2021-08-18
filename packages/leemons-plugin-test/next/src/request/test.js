async function test(body) {
  return leemons.api('test', {
    method: 'POST',
    body,
  });
}

export default test;
