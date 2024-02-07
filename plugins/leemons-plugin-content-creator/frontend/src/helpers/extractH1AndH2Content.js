/* eslint-disable no-bitwise */
const extractH1AndH2Content = (htmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const h1Elements = Array.from(doc.querySelectorAll('h1'));
  const h2Elements = Array.from(doc.querySelectorAll('h2'));

  return [...h1Elements, ...h2Elements]
    .sort((a, b) => {
      const position = a.compareDocumentPosition(b);
      if ((position & Node.DOCUMENT_POSITION_FOLLOWING) !== 0) {
        return -1;
      }
      if ((position & Node.DOCUMENT_POSITION_PRECEDING) !== 0) {
        return 1;
      }
      return 0;
    })
    .map((element) => element.textContent.trim());
};

export default extractH1AndH2Content;
