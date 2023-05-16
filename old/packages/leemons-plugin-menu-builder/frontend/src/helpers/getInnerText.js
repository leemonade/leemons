export default function getInnerText(obj) {
  let buf = '';
  if (obj) {
    const type = typeof obj;
    if (type === 'string' || type === 'number') {
      buf += obj;
    } else if (type === 'object') {
      let children = null;
      if (Array.isArray(obj)) {
        children = obj;
      } else if (obj.props) {
        children = obj.props.children;
      }
      if (children) {
        if (Array.isArray(children)) {
          children.forEach((o) => {
            buf += getInnerText(o);
          });
        } else {
          buf += getInnerText(children);
        }
      }
    }
  }
  return buf;
}
