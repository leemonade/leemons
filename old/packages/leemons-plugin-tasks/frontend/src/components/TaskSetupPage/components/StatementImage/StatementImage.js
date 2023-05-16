import React, { useState, useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import {
  Box,
  Button,
  createStyles,
  useResizeObserver,
  useViewportSize,
  InputWrapper,
} from '@bubbles-ui/components';
import { LibraryCardEmbed } from '@bubbles-ui/leemons';
import { AssetListDrawer } from '@leebrary/components';
import { uniqBy, map } from 'lodash';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import getAssetsByIds from '@leebrary/request/getAssetsByIds';
import { RemoveIcon } from '@bubbles-ui/icons/outline';

const styles = createStyles((theme) => ({
  attachmentContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[5],
  },
}));

export default function StatementImage({ labels }) {
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
    --- Sizings ---
  */
  const { width: viewportWidth } = useViewportSize();
  const [boxRef, rect] = useResizeObserver();
  const drawerSize = useMemo(
    () => Math.max(viewportWidth - rect.width - 370, 600),
    [viewportWidth, rect]
  );

  /*
    --- Form ---
  */
  const { setValue, getValues } = useFormContext();

  /*
    --- Resources state ---
  */
  const [resources, setResources] = useState([]);
  useEffect(() => {
    (async () => {
      const formResources = getValues('metadata.leebrary.statementImage');
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
      setValue('metadata.leebrary.statementImage', map(newResources, 'id'), {
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
      setValue('metadata.leebrary.statementImage', map(newResources, 'id'), {
        shouldDirty: true,
        shouldTouch: true,
      });
    },

    [setResources]
  );

  /*
    --- Render ---
  */

  if (resources?.length) {
    return (
      <InputWrapper label="Imágen de apoyo">
        <Box className={classes?.attachmentContainer}>
          {resources.map((asset) => (
            <LibraryCardEmbed
              asset={{ ...asset, title: asset.name, image: asset.cover }}
              key={asset.id}
              actionIcon={
                <Box
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    onAssetRemove(asset);
                  }}
                >
                  <RemoveIcon />
                </Box>
              }
            />
          ))}
        </Box>
      </InputWrapper>
    );
  }

  return (
    <InputWrapper label={labels?.supportImage}>
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
          <Button variant="outline" onClick={toggleDrawer}>
            {labels?.searchFromLibrary}
          </Button>
          <AssetListDrawer
            opened={showAssetDrawer}
            creatable
            size={drawerSize}
            shadow={drawerSize <= 600}
            onSelect={onAssetSelect}
            onClose={onDrawerClose}
            onlyThumbnails={false}
            itemMinWidth={200}
          />
        </form>
      </Box>
    </InputWrapper>
  );
}

StatementImage.propTypes = {
  labels: PropTypes.object,
};
