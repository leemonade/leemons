import loadable from '@loadable/component';

export function dynamicImport(path) {
  return loadable(() => import(`@leemons/plugins/${path}`));
}

export default dynamicImport;
