import { cloneDeep, get, set, uniq } from 'lodash';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';

import {
  Box,
  Button,
  createStyles,
  useResizeObserver,
  useViewportSize,
} from '@bubbles-ui/components';
import { ChevLeftIcon, ChevRightIcon } from '@bubbles-ui/icons/outline';

import { useModuleSetupContext } from '@learning-paths/contexts/ModuleSetupContext';
import { AssetPickerDrawer } from '@leebrary/components/AssetPickerDrawer';
import { EmptyState } from '../StructureData/components/EmptyState';
import { ResourcesTable } from './components/ResourcesTable';

export const useResourcesStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      display: 'flex',
    },
    content: {
      paddingLeft: globalTheme.spacing.padding.xlg,
      paddingRight: globalTheme.spacing.padding.xlg,
      paddingTop: globalTheme.spacing.padding.xlg,
    },
    buttons: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',

      borderTop: `1px solid ${globalTheme.border.color.line.muted}`,
      marginTop: globalTheme.spacing.padding.xlg,

      paddingLeft: globalTheme.spacing.padding.xlg,
      paddingRight: globalTheme.spacing.padding.xlg,
      paddingTop: globalTheme.spacing.padding.xlg,
      paddingBottom: globalTheme.spacing.padding.xlg,
    },
  };
});

export function Resources({ localizations, onNextStep, onPrevStep }) {
  const [showAssetDrawer, setShowAssetDrawer] = useState(false);

  const { width: viewportWidth } = useViewportSize();
  const [boxRef, rect] = useResizeObserver();
  const drawerSize = useMemo(() => Math.max(viewportWidth / 2, 500), [viewportWidth, rect]);

  const [sharedData, setSharedData] = useModuleSetupContext();

  const { classes } = useResourcesStyles();
  return (
    <Box ref={boxRef}>
      <Box className={classes.content}>
        <AssetPickerDrawer
          layout="cards"
          categories={['media-files', 'bookmarks', 'assignables.content-creator']}
          creatable
          onClose={() => setShowAssetDrawer(false)}
          onSelect={(asset) => {
            setSharedData((data) =>
              set(
                cloneDeep(data),
                'state.resources',
                uniq([...get(data, 'state.resources', []), asset.id])
              )
            );
            setShowAssetDrawer(false);
          }}
          opened={showAssetDrawer}
          shadow={drawerSize <= 720}
          size={drawerSize}
        />
        {get(sharedData, 'state.resources', [])?.length ? (
          <ResourcesTable
            onAssetChange={(newAssets) => {
              setSharedData((data) => set(cloneDeep(data), 'state.resources', newAssets));
            }}
            onSelectAsset={() => setShowAssetDrawer(1)}
            onRemoveAsset={(id) =>
              setSharedData((data) => {
                const index = data.state.resources.findIndex((value) => value === id);
                const newData = cloneDeep(data);

                newData.state.resources.splice(index, 1);

                return newData;
              })
            }
            localizations={localizations}
          />
        ) : (
          <EmptyState
            localizations={localizations?.steps?.resourcesData}
            onSelectAsset={() => setShowAssetDrawer(true)}
          />
        )}
      </Box>
      <Box className={classes.buttons}>
        <Button variant="link" leftIcon={<ChevLeftIcon />} onClick={onPrevStep}>
          {localizations?.buttons?.previous}
        </Button>
        <Button onClick={() => onNextStep()} rightIcon={<ChevRightIcon />} variant="outline">
          {localizations?.buttons?.next}
        </Button>
      </Box>
    </Box>
  );
}

Resources.propTypes = {
  localizations: PropTypes.object,
  onNextStep: PropTypes.func,
  onPrevStep: PropTypes.func,
};
