import React, { useState, useCallback, useEffect } from 'react';
import { uniqBy, map } from 'lodash';
import { Box, Button, createStyles, SortableList } from '@bubbles-ui/components';
import PropTypes from 'prop-types';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import getAssetsByIds from '@leebrary/request/getAssetsByIds';
import { AddCircleIcon } from '@bubbles-ui/icons/solid';
import { AssetPickerDrawer } from '@leebrary/components/AssetPickerDrawer';

import { AttachmentItem } from './AttchmentItem';

const styles = createStyles(() => ({
  attachmentContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
}));

function Attachments({ setValue, getValues, labels }) {
  /*
    --- Drawer state ---
  */
  const [showAssetDrawer, setShowAssetDrawer] = useState(false);
  const onDrawerClose = useCallback(() => setShowAssetDrawer(false), [setShowAssetDrawer]);
  const toggleDrawer = useCallback(
    () => setShowAssetDrawer((showDrawer) => !showDrawer),
    [setShowAssetDrawer]
  );

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
      <Box>
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
          <AssetPickerDrawer
            opened={showAssetDrawer}
            layout="rows"
            categories={['bookmarks', 'media-files']}
            creatable
            onClose={onDrawerClose}
            onSelect={onAssetSelect}
            shadow
          />
        </form>
      </Box>
      <Box className={classes?.attachmentContainer}>
        <SortableList
          value={resources}
          onChange={setResources}
          itemRender={AttachmentItem}
          onRemove={onAssetRemove}
        />
      </Box>
    </>
  );
}

Attachments.propTypes = {
  setValue: PropTypes.func,
  getValues: PropTypes.func,
  labels: PropTypes.any,
};

export default Attachments;
export { Attachments };
