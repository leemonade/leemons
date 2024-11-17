/* eslint-disable sonarjs/cognitive-complexity */
import React from 'react';
import { Box, Text } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { AssetMetadataScormStyles } from './AssetMetadataScorm.styles';
import {
  ASSET_METADATA_SCORM_DEFAULT_PROPS,
  ASSET_METADATA_SCORM_PROP_TYPES,
} from './AssetMetadataScorm.constants';
import { ScormCardIcon } from '../icons';
import usePackage from '../../request/hooks/queries/usePackage';

const AssetMetadataScorm = ({ metadata }) => {
  const [t] = useTranslateLoader('scorm.scormDetail');
  const scormVersion = metadata?.providerData?.metadata?.version;
  const { data: scormData } = usePackage({ id: metadata?.providerData?.id, enabled: !!metadata });
  const scormSize = scormData && scormData.file.size / 1024 / 1024;

  const { classes } = AssetMetadataScormStyles({}, { name: 'scormDetail' });

  if (!metadata) return null;

  return (
    <Box>
      <Box className={classes.typologyContainer}>
        <ScormCardIcon />
        <Text className={classes.typologyName}>{`${t('type')}`}</Text>
      </Box>
      <Box className={classes.box}>
        {scormVersion && (
          <Box>
            <Text className={classes.title}>{`${t('version')}: `}</Text>
            <Text className={classes.value}>{scormVersion}</Text>
          </Box>
        )}
        {scormSize && (
          <Box>
            <Text className={classes.title}>{`${t('size')}: `}</Text>
            <Text className={classes.value}>{`${Math.round(scormSize)} Mb`}</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};
AssetMetadataScorm.propTypes = ASSET_METADATA_SCORM_PROP_TYPES;
AssetMetadataScorm.defaultProps = ASSET_METADATA_SCORM_DEFAULT_PROPS;
AssetMetadataScorm.displayName = 'AssetMetadataScorm';

export default AssetMetadataScorm;
export { AssetMetadataScorm };
