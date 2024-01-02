const extractH1Content = (htmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const h1Elements = doc.getElementsByTagName('h1');
  return Array.from(h1Elements).map((h1) => h1.textContent);
};

export default extractH1Content;
