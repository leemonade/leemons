import { uniqBy } from 'lodash';

import { getAssetTypesRequest } from '@leebrary/request';
import prepareAssetType from '@leebrary/helpers/prepareAssetType';

export default async function loadMediaTypes(categoryId) {
  try {
    const response = await getAssetTypesRequest(categoryId);
    return uniqBy(
      response.types?.map((type) => ({
        label: prepareAssetType(type),
        value: prepareAssetType(type, false),
      })),
      'value'
    );
  } catch (err) {
    return [];
  }
}

export { loadMediaTypes };
