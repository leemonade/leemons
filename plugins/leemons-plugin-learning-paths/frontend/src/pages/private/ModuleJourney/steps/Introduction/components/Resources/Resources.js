import React from 'react';
import { getAssetsByIdsRequest } from '@leebrary/request';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import { useApi } from '@common';
import { LibraryItem } from '@leebrary/components';
import { Box } from '@bubbles-ui/components';

async function getResources(ids) {
  const response = await getAssetsByIdsRequest(ids, { showPublic: true, indexable: 0 });

  return response.assets.map((asset) => prepareAsset(asset));
}

const Resources = ({ assignation }) => {
  const [resources] = useApi(getResources, assignation?.instance?.assignable?.resources);
  return <Box>{resources && resources?.map((res) => <LibraryItem asset={res} />)}</Box>;
};

export default Resources;
export { Resources };
