import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useModuleSetupContext } from '@learning-paths/contexts/ModuleSetupContext';
import useAssets from '@leebrary/request/hooks/queries/useAssets';
import { Box, Button, FileIcon, Table } from '@bubbles-ui/components';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import { AddIcon, DeleteBinIcon } from '@bubbles-ui/icons/outline';
import { concat, get, keyBy, map } from 'lodash';
import { useCache } from '@common';
import { ResourceRenderer } from '../../../StructureData/components/ModuleComposer/components/ResourceRenderer';

// useLocalizations

// useStyles

export function useColumns({ localizations }) {
  return useMemo(
    () => [
      {
        Header: localizations?.resource ?? '',
        accessor: 'resource',
      },
      {
        Header: localizations?.actions ?? '',
        accessor: 'actions',
      },
    ],
    [localizations]
  );
}

function useSelectedResources() {
  const [sharedData] = useModuleSetupContext();
  const { resources } = sharedData.state;

  const cache = useCache();

  const { data: nonIndexableAssets } = useAssets({
    ids: resources,
    filters: { indexable: 0 },
    enabled: !!resources.length,
    placeholderData: [],
    keepPreviousData: true,
  });

  const { data: indexableAssets } = useAssets({
    ids: resources,
    filters: { indexable: 1 },
    enabled: !!resources.length,
    placeholderData: [],
    keepPreviousData: true,
  });

  const assets = concat(
    [],
    cache('nonIndexableAssets', nonIndexableAssets),
    cache('indexableAssets', indexableAssets)
  );

  const assetsById = useMemo(() => keyBy(assets, 'id'));

  return assetsById;
}

function useParseResources({ assets, onRemove, localizations }) {
  const [sharedData] = useModuleSetupContext();

  const resources = get(sharedData, 'state.resources', []);

  return useMemo(
    () =>
      resources
        .map((resource) => {
          const asset = assets[resource];

          if (!asset) {
            return null;
          }
          const preparedAsset = prepareAsset(asset);

          return {
            id: asset.id,
            resource: (
              <ResourceRenderer
                key={asset.id}
                activity={{
                  asset,
                  roleDetails: {
                    icon: (
                      <FileIcon
                        size={12}
                        fileExtension={preparedAsset.fileExtension}
                        fileType={preparedAsset.fileType}
                      />
                    ),
                  },
                  updated_at: asset.updated_at,
                }}
                localizations={localizations?.steps?.resourcesData?.moduleComposer}
              />
            ),
            actions: (
              <DeleteBinIcon style={{ cursor: 'pointer' }} onClick={() => onRemove(asset.id)} />
            ),
          };
        })
        .filter(Boolean),
    [resources, assets, onRemove]
  );
}

export function ResourcesTable({ localizations, onRemoveAsset, onAssetChange, onSelectAsset }) {
  const columns = useColumns({
    localizations: localizations?.steps?.resourcesData?.moduleComposer?.columns,
  });
  const assets = useSelectedResources();
  const parsedResources = useParseResources({ assets, localizations, onRemove: onRemoveAsset });

  return (
    <Box>
      <Table
        columns={columns}
        data={parsedResources}
        sortable={parsedResources?.length > 1}
        labels={{ add: '' }}
        onChangeData={({ newData }) => onAssetChange(map(newData, 'id'))}
      />
      <Button variant="link" leftIcon={<AddIcon />} onClick={onSelectAsset}>
        {localizations?.steps?.resourcesData?.buttons?.new}
      </Button>
    </Box>
  );
}

ResourcesTable.propTypes = {
  localizations: PropTypes.object,
  onRemoveAsset: PropTypes.func,
  onAssetChange: PropTypes.func,
  onSelectAsset: PropTypes.func,
};
