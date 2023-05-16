import { getFileUrl } from '@leebrary/helpers/prepareAsset';

export function getClassImage(classe) {
  if (classe?.image?.cover) {
    return getFileUrl(classe.image.cover.id);
  }
  if (classe.subject?.image?.cover) {
    return getFileUrl(classe.subject.image.cover.id);
  }
  return null;
}
