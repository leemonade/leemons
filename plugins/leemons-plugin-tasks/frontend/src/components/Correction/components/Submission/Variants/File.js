import React, { useState, useEffect } from 'react';
import { Text, ContextContainer, Box, Loader, Anchor } from '@bubbles-ui/components';
import { LibraryCardEmbed } from '@bubbles-ui/leemons';
import getAssetsByIds from '@leebrary/request/getAssetsByIds';
import prepareAsset from '@leebrary/helpers/prepareAsset';

export default function File({ assignation, labels }) {
  const submittedFiles = assignation.metadata?.submission;
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    (async () => {
      if (!submittedFiles?.length) {
        return;
      }
      let files = await getAssetsByIds(
        submittedFiles.map((file) => file.id),
        { showPublic: true, indexable: false }
      );

      /**
  id: PropTypes.string,
  fileType: PropTypes.string,
  fileExtension: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  tagline: PropTypes.string,
  metadata: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.any, value: PropTypes.any })),
  created: PropTypes.string,
  version: PropTypes.string,
  cover: PropTypes.string,
  color: PropTypes.string,
  url: PropTypes.string,
  icon: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  category: PropTypes.string,
  role: PropTypes.oneOf(LIBRARYCARD_ROLES),
     */
      files = files.assets.map((asset) => {
        const preparedAsset = prepareAsset(asset);
        return {
          id: preparedAsset.id,
          fileType: preparedAsset.file.extension,
          // fileExtension: preparedAsset.file.extension,
          title:
            preparedAsset.name.substr(0, preparedAsset.name.lastIndexOf('.')) || preparedAsset.name,
          description: preparedAsset.description,
          // tagline: preparedAsset.tagline,
          // metadata: preparedAsset.metadata,
          // created: preparedAsset.created_at,
          // version: '',
          cover: null,
          color: preparedAsset.color,
          url: preparedAsset.url,
          // icon: preparedAsset.icon,
          // tags: preparedAsset.tags,
          category: preparedAsset.category,
          role: null,
        };
      });

      // console.log('files', files);

      setAssets(files);
    })();
  }, [submittedFiles]);

  if (Array.isArray(submittedFiles)) {
    if (!assets?.length) {
      return <Loader />;
    }
    return (
      <Box>
        <ContextContainer spacing={2}>
          {assets.map((asset) => (
            <>
              <LibraryCardEmbed asset={asset} variant="media" />
              {/* <Anchor target="_blank" href={asset.url} key={asset.id}>
                {asset.name}
              </Anchor> */}
            </>
          ))}
        </ContextContainer>
      </Box>
    );
  }
  return <Text>{labels?.types?.file?.noSubmission}</Text>;
}
