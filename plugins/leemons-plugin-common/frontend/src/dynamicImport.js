import loadable from '@loadable/component';

export default function dynamicImport(path) {
  return loadable(() => import(`@app/plugins/${path}`));
}
