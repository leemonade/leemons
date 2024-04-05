import React, { useEffect, useState } from 'react';
import { Box, Text, HtmlText, TextClamp } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { AssetMetadataTaskStyles } from './AssetMetadataTask.styles';
import {
  ASSET_METADATA_TASK_DEFAULT_PROPS,
  ASSET_METADATA_TASK_PROP_TYPES,
} from './AssetMetadataTask.constants';
import { TaskIcon } from '../Icons/TaskIcon';
import { ExpressTaskIcon } from '../Icons/ExpressTaskIcon';
import { prefixPN } from '../../helpers/prefixPN';

const AssetMetadataTask = ({ metadata }) => {
  const isTaskExpress = metadata?.providerData?.metadata?.express;
  const isDeliverable = !!metadata?.providerData?.submission?.data;
  const statement = metadata?.providerData?.statement;
  const [t] = useTranslateLoader(prefixPN('library_page'));
  const [fields, setFields] = useState();
  const { classes } = AssetMetadataTaskStyles({}, { name: 'AssetMetadataTask' });
  const getFieldsToRender = (metadataTask) => {
    let extensions = '(';
    const fileType = metadataTask?.providerData?.submission?.type;
    const maxSize = metadataTask?.providerData?.submission?.data?.maxSize
      ? `${metadataTask?.providerData?.submission?.data?.maxSize}Mb`
      : null;
    if (isDeliverable) {
      const keys = Object.keys(metadataTask?.providerData?.submission?.data?.extensions);
      keys.forEach((key, index) => {
        extensions += `${key}`;
        if (index !== keys.length - 1) {
          extensions += ',';
        }
      });
      extensions += ')';
    }
    return {
      extensions,
      fileType,
      maxSize,
    };
  };

  useEffect(() => {
    if (metadata) {
      setFields(getFieldsToRender(metadata));
    }
  }, [metadata]);

  if (!fields) return null;
  return (
    <Box>
      <Box className={classes.typologyContainer}>
        {isTaskExpress ? (
          <ExpressTaskIcon width={24} height={24} />
        ) : (
          <TaskIcon width={24} height={24} />
        )}
        <Text className={classes.value}>{isTaskExpress ? t('expressVariant') : t('variant')}</Text>
      </Box>
      <Box className={classes.box}>
        <Box>
          <Text className={classes.title}>{`${t('deliverables')}: `}</Text>
          <Text className={classes.value}>{isDeliverable ? `${t('yes')}.` : t('no')}</Text>
          {isDeliverable && (
            <Text className={classes.value}>
              {` ${fields.fileType} ${fields.extensions} ${fields.maxSize}`}
            </Text>
          )}
        </Box>
        {!!statement && (
          <Box>
            <Text className={classes.valueDescription}>{`${t('statementTitle')}: `}</Text>
            <TextClamp lines={3} withToggle showMore={t('viewMore')} showLess={t('viewLess')}>
              <Text>
                <HtmlText>{statement}</HtmlText>
              </Text>
            </TextClamp>
          </Box>
        )}
      </Box>
    </Box>
  );
};
AssetMetadataTask.propTypes = ASSET_METADATA_TASK_PROP_TYPES;
AssetMetadataTask.defaultProps = ASSET_METADATA_TASK_DEFAULT_PROPS;
AssetMetadataTask.displayName = 'AssetMetadataTask';

export default AssetMetadataTask;
export { AssetMetadataTask };
