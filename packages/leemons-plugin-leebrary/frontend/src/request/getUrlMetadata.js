async function getUrlMetadata(url) {
  return leemons.api(`leebrary/assets/url-metadata?url=${url}`, {
    allAgents: true,
    method: 'GET',
  });
}

export default getUrlMetadata;
