async function getFileCopyright(fileId) {
  return leemons.api(`v1/leebrary/file/copyright/${fileId}`, {
    method: 'GET',
  });
}

export default getFileCopyright;
