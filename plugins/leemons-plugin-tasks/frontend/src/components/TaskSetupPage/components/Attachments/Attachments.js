import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Box,
  Button,
  createStyles,
  useResizeObserver,
  useViewportSize,
  SortableList,
} from '@bubbles-ui/components';
// TODO: import from @library plugin
import { AssetListDrawer } from '@leebrary/components';
import { AddCircleIcon } from '@bubbles-ui/icons/outline';
import { uniqBy, map } from 'lodash';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import getAssetsByIds from '@leebrary/request/getAssetsByIds';

import { AttachmentItem } from './AttchmentItem';

const styles = createStyles((theme) => ({
  attachmentContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
}));

export default function Attachments({ setValue, getValues, labels }) {
  /*
    --- Drawer state ---
  */
  const [assetType, setAssetType] = useState('');
  const [showAssetDrawer, setShowAssetDrawer] = useState(false);
  const onDrawerClose = useCallback(() => setShowAssetDrawer(false), [setShowAssetDrawer]);
  const toggleDrawer = useCallback(
    () => setShowAssetDrawer((showDrawer) => !showDrawer),
    [setShowAssetDrawer]
  );
  /*
    --- Sizings ---
  */
  const { width: viewportWidth } = useViewportSize();
  const [boxRef, rect] = useResizeObserver();
  const drawerSize = useMemo(() => Math.max(Math.round(viewportWidth * 0.3), 720), [viewportWidth]);

  /*
    --- Resources state ---
  */
  const [resources, setResources] = useState([]);
  useEffect(() => {
    (async () => {
      const formResources = getValues('resources');
      if (formResources?.length) {
        const savedAssets = await getAssetsByIds(formResources, { public: true, indexable: false });
        const newAssets = await getAssetsByIds(formResources, { public: true });

        const assets = uniqBy([...savedAssets.assets, ...newAssets.assets], 'id');
        const preparedAssets = assets?.map(prepareAsset);
        if (preparedAssets?.length) {
          setResources(preparedAssets);
        }
      }
    })();
  }, []);

  useEffect(() => {
    setValue('resources', map(resources, 'id'), {
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [resources]);

  /*
    --- Styles ---
  */
  const { classes } = styles();

  const onAssetSelect = useCallback(
    (asset) => {
      let newResources;
      setResources((currentResources) => {
        newResources = uniqBy([...currentResources, prepareAsset(asset)], 'id');

        return newResources;
      });
      onDrawerClose();
      setValue('resources', map(newResources, 'id'), {
        shouldDirty: true,
        shouldTouch: true,
      });
    },
    [setResources]
  );

  const onAssetRemove = useCallback(
    (asset) => {
      let newResources;
      setResources((currentResources) => {
        newResources = currentResources.filter((resource) => resource.id !== asset.id);
        return newResources;
      });
      setValue('resources', map(newResources, 'id'), { shouldDirty: true, shouldTouch: true });
    },

    [setResources]
  );

  /*
    --- Render ---
  */

  return (
    <>
      <Box className={classes?.attachmentContainer}>
        <SortableList
          value={resources}
          onChange={setResources}
          itemRender={AttachmentItem}
          onRemove={onAssetRemove}
        />
      </Box>
      <Box ref={boxRef}>
        <form
          onSubmit={(e) => {
            // EN: Added to prevent the event from bubbling up to the parent form
            // ES: Añadido para evitar que el evento se propague hacia arriba del formulario
            if (typeof e.preventDefault === 'function') {
              e.preventDefault();
            }

            if (typeof e.stopPropagation === 'function') {
              e.stopPropagation();
            }
          }}
        >
          <Button variant="link" onClick={toggleDrawer} leftIcon={<AddCircleIcon />}>
            {labels?.addResource}
          </Button>
          <AssetListDrawer
            opened={showAssetDrawer}
            creatable
            size={drawerSize}
            shadow={drawerSize <= 720}
            assetType={assetType}
            canChangeType
            onTypeChange={setAssetType}
            onSelect={onAssetSelect}
            onClose={onDrawerClose}
            onlyThumbnails={false}
            allowChangeCategories={['bookmarks', 'media-files']}
            itemMinWidth={250}
          />
        </form>
      </Box>
    </>
  );
}

export { Attachments };
