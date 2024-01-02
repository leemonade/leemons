/* eslint-disable no-unsafe-optional-chaining */
import React, { useEffect, useState } from 'react';
import { Box, Text, TextClamp, FileIcon } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { DuplicateIcon } from '@bubbles-ui/icons/outline';
import {
  METADATA_DISPLAY_PROP_TYPES,
  METADATA_DISPLAY_DEFAULT_PROPS,
} from './MetadataDisplay.constants';
import { MetadataDisplayStyles } from './MetadataDisplay.styles';
import prefixPn from '../../../../helpers/prefixPN';

const MetadataDisplay = ({ metadata, onCopy }) => {
  const [data, setData] = useState();
  const fileSizeMB = metadata?.file?.size / 1024;
  const fileSizeDocument = metadata?.fileType === 'document' && metadata?.metadata[0]?.value;
  const getImageDimensions = () => {
    const dataObject = {};
    if (metadata?.fileType === 'image') {
      metadata.metadata.forEach((item) => {
        if (item.label === 'Size') {
          dataObject.size = item.value;
        }
        if (item.label === 'Width') {
          dataObject.width = item.value;
        }
        if (item.label === 'Height') {
          dataObject.height = item.value;
        }
      });
    }
    return dataObject;
  };
  const getVideoData = () => {
    const dataObject = {};
    if (metadata?.fileType === 'video') {
      metadata.metadata.forEach((item) => {
        if (item.label === 'Duration') {
          dataObject.duration = item.value;
        }
        if (item.label === 'Size') {
          dataObject.size = item.value;
        }
        if (item.label === 'Width') {
          dataObject.width = item.value;
        }
        if (item.label === 'Height') {
          dataObject.height = item.value;
        }
      });
    }
    return dataObject;
  };

  useEffect(() => {
    if (metadata?.fileType === 'image') {
      setData(getImageDimensions());
    }
    if (metadata?.fileType === 'video') {
      setData(getVideoData());
    }
    if (metadata?.fileType === 'bookmark') {
      setData({ url: metadata?.url, name: metadata.name });
    }
  }, [metadata]);

  const [t] = useTranslateLoader(prefixPn('assetsList'));
  const { classes } = MetadataDisplayStyles({}, { name: 'MetadataDisplay' });
  const variantIconLabel =
    (metadata?.variantTitle ?? metadata?.fileType ?? metadata?.variant)?.charAt(0)?.toUpperCase() +
    (metadata?.variantTitle ?? metadata?.fileType ?? metadata?.variant)?.slice(1);

  return (
    <Box className={classes.root}>
      {metadata?.variantIcon ? (
        <Box className={classes.FileIconRoot}>
          {metadata?.variantIcon}
          {variantIconLabel && <Text className={classes.FileIconLabel}>{variantIconLabel}</Text>}
        </Box>
      ) : (
        <Box className={classes.fileIconContainer}>
          <FileIcon
            size={24}
            fileType={
              metadata?.fileType === 'document'
                ? metadata?.fileExtension
                : metadata?.fileType || metadata?.variant
            }
            fileExtension={metadata?.fileExtension}
            color={'#878D96'}
            hideExtension
          />
          <Text className={classes.fileLabel}>
            {metadata?.fileType === 'document' || metadata?.fileType === 'application'
              ? `.${metadata?.fileExtension}`
              : variantIconLabel}
          </Text>
        </Box>
      )}
      <Box className={classes.box}>
        {metadata?.fileType === 'application' && (
          <Box>
            <Text className={classes.title}>{`${t('size')}: `}</Text>
            <Text className={classes.value}>{`${fileSizeMB.toFixed(2)} MB`}</Text>
          </Box>
        )}
        {metadata?.fileType === 'image' && (
          <Box>
            <Box>
              <Text className={classes.title}>{`${t('dimensions')}: `}</Text>
              <Text className={classes.value}>{`${data?.width} x ${data?.height}`}</Text>
            </Box>
            <Box>
              <Text className={classes.title}>{`${t('format')}: `}</Text>
              <Text className={classes.value}>{`.${metadata?.file?.extension}`}</Text>
            </Box>
            <Box>
              <Text className={classes.title}>{`${t('size')}: `}</Text>
              <Text className={classes.value}>{`${fileSizeMB.toFixed(2)} Mb`}</Text>
            </Box>
          </Box>
        )}
        {metadata?.fileType === 'video' && (
          <Box>
            <Box>
              <Text className={classes.title}>{`${t('duration')}: `}</Text>
              <Text className={classes.value}>{`${data?.duration}`}</Text>
            </Box>
            <Box>
              <Text className={classes.title}>{`${t('dimensions')}: `}</Text>
              <Text className={classes.value}>{`${data?.width} x ${data?.height}`}</Text>
            </Box>
            <Box>
              <Text className={classes.title}>{`${t('size')}: `}</Text>
              <Text className={classes.value}>{`${fileSizeDocument}`}</Text>
            </Box>
          </Box>
        )}
        {metadata?.fileType === 'bookmark' && (
          <Box>
            <Box>
              <Text className={classes.value}>{metadata.name}</Text>
            </Box>
            <Box className={classes.url}>
              <Box>
                <TextClamp lines={1}>
                  <Text className={classes.title}>{metadata.url}</Text>
                </TextClamp>
              </Box>
              <Box onClick={onCopy} style={{ cursor: 'pointer' }}>
                <DuplicateIcon width={22} height={22} color={'rgb(135, 141, 150)'} />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

MetadataDisplay.displayName = 'MetadataDisplay';
MetadataDisplay.propTypes = METADATA_DISPLAY_PROP_TYPES;
MetadataDisplay.defaultProps = METADATA_DISPLAY_DEFAULT_PROPS;

export default MetadataDisplay;
export { MetadataDisplay };
