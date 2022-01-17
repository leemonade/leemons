const nodeFetch = require('node-fetch');

function fetch(url, headers) {
  return nodeFetch(url, headers);
}

async function fetchJson(url, headers) {
  const request = await nodeFetch(url, headers);
  const data = await request.json();
  return data;
}

async function fetchText(url, headers) {
  const request = await nodeFetch(url, headers);
  const data = await request.text();
  return data;
}

module.exports = { fetch, fetchJson, fetchText };
