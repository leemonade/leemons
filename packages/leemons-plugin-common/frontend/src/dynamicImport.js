import loadable from '@loadable/component';

export function dynamicImport(path) {
  return loadable(() => import(`@plugins/../plugins/${path}`));
}

export default dynamicImport;
