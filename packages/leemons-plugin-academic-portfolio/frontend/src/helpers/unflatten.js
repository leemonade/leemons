export default function unflatten(data) {
  if (Object(data) !== data || Array.isArray(data)) return data;
  const regex = /\.?([^.[\]]+)|\[(\d+)\]/g;
  const resultholder = {};
  Object.keys(data).forEach((p) => {
    let cur = resultholder;
    let prop = '';
    let m;
    // eslint-disable-next-line no-cond-assign
    while ((m = regex.exec(p))) {
      cur = cur[prop] || (cur[prop] = m[2] ? [] : {});
      prop = m[2] || m[1];
    }
    cur[prop] = data[p];
  });

  return resultholder[''] || resultholder;
}
