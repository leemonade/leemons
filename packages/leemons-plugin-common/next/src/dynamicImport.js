import dynamic from 'next/dynamic';

export function dynamicImport(path) {
  return dynamic(() => import(`@plugins/../plugins/${path}`));
}
