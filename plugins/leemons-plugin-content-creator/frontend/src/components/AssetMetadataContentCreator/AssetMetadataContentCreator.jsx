/* eslint-disable sonarjs/cognitive-complexity */
import React from 'react';
import { Box, Text, TextClamp } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useDocument from '@content-creator/request/hooks/queries/useDocument';
import prefixPN from '@content-creator/helpers/prefixPN';
import extractH1AndH2Content from '@content-creator/helpers/extractH1AndH2Content';
import { AssetMetadataContentCreatorStyles } from './AssetMetadataContentCreator.styles';
import {
  ASSET_METADATA_CONTENT_CREATOR_DEFAULT_PROPS,
  ASSET_METADATA_CONTENT_CREATOR_PROP_TYPES,
} from './AssetMetadataContentCreator.constants';
import { ContentCreatorCardIcon } from '../icons/ContentCreatorCardIcon';

const AssetMetadataContentCreator = ({ metadata }) => {
  const [t] = useTranslateLoader(prefixPN('contentCreatorDetail'));

  const { classes } = AssetMetadataContentCreatorStyles(
    {},
    { name: 'AssetMetadataContentCreator' }
  );

  const { data: documentData } = useDocument({
    id: metadata?.providerData?.id,
  });
  const getH1andH2 = (document) => {
    if (documentData) {
      return extractH1AndH2Content(document.content);
    }
    return [];
  };
  const h1andH2Content = getH1andH2(documentData);

  if (!metadata) return null;

  return (
    <Box>
      <Box className={classes.typologyContainer}>
        <ContentCreatorCardIcon />
        <Text className={classes.typologyName}>{`${t('type')}`}</Text>
      </Box>
      <Box className={classes.box}>
        {!!h1andH2Content && h1andH2Content.length > 0 && (
          <Box>
            <Text className={classes.value}>{`${t('schemaLabel')}: `}</Text>
            {h1andH2Content.map((node, index) => (
              <TextClamp lines={1} key={index}>
                <Text className={classes.h1Header}>{node}</Text>
              </TextClamp>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};
AssetMetadataContentCreator.propTypes = ASSET_METADATA_CONTENT_CREATOR_PROP_TYPES;
AssetMetadataContentCreator.defaultProps = ASSET_METADATA_CONTENT_CREATOR_DEFAULT_PROPS;
AssetMetadataContentCreator.displayName = 'AssetMetadataContentCreator';

export default AssetMetadataContentCreator;
export { AssetMetadataContentCreator };
