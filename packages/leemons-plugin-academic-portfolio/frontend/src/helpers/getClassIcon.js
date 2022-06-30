import { getFileUrl } from '@leebrary/helpers/prepareAsset';

export function getClassIcon(classe) {
  if (classe.subject?.icon?.cover) {
    return getFileUrl(classe.subject.icon.cover.id);
  }
  return null;
}
