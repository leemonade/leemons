import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useModuleSetupContext } from '@learning-paths/contexts/ModuleSetupContext';
import useAssets from '@leebrary/request/hooks/queries/useAssets';
import { Box, Button, FileIcon, Table, ActionButton } from '@bubbles-ui/components';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import { AddCircleIcon, DeleteBinIcon } from '@bubbles-ui/icons/solid';
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

  return useMemo(() => keyBy(assets, 'id'));
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
                  updatedAt: asset.updatedAt,
                }}
                localizations={localizations?.steps?.resourcesData?.moduleComposer}
              />
            ),
            actions: (
              <ActionButton
                onClick={() => onRemove(asset.id)}
                icon={<DeleteBinIcon width={18} height={18} />}
              />
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
    <Box sx={() => ({ width: 550 })}>
      <Table
        columns={columns}
        data={parsedResources}
        sortable={parsedResources?.length > 1}
        labels={{ add: '' }}
        headerStyles={{ display: 'none' }}
        onChangeData={({ newData }) => onAssetChange(map(newData, 'id'))}
      />
      <Button variant="link" leftIcon={<AddCircleIcon />} onClick={onSelectAsset}>
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
