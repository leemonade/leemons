import prefixPN from '@board-messages/helpers/prefixPN';
import { addClickRequest } from '@board-messages/request';
import { Box, Button, ImageLoader, Text, Stack } from '@bubbles-ui/components';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import useTranslateObjectLoader from '@multilanguage/useTranslateObjectLoader';
import PropTypes from 'prop-types';
import React from 'react';
import { BannerMessageStyles } from './BannerMessage.styles';

const BannerMessage = ({ message }) => {
  const labels = useTranslateObjectLoader(prefixPN('modal'));
  const preparedAsset = prepareAsset(message.asset || {});

  const openLink = () => {
    addClickRequest(message.id);

    if (message.url?.startsWith('http')) {
      window.open(message.url, '_blank', 'noopener');
    }
  };

  const stringToHTML = (str) => ({ __html: str });

  const { classes } = BannerMessageStyles({}, { name: 'ModalMessage' });
  return (
    <Box className={classes.root}>
      <Box className={classes.title}>
        <Text color="primary" size="lg">
          {labels.title}
        </Text>
      </Box>
      <Box className={classes.messageWrapper}>
        <Box className={classes.messageRoot}>
          {message.asset?.cover && (
            <Box>
              <ImageLoader src={preparedAsset?.cover} width={275} height={'100%'} />
            </Box>
          )}
          <Box className={classes.contentWrapper}>
            <Stack direction="column" fullHeight spacing={5} justifyContent="space-between">
              <Box className={classes.title}>{message.internalName}</Box>
              <Box
                className={classes.message}
                dangerouslySetInnerHTML={stringToHTML(message.message)}
              />
              {message.url && (
                <Box className={classes.link}>
                  <Button onClick={openLink}>{message.textUrl}</Button>
                </Box>
              )}
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

BannerMessage.propTypes = {
  message: PropTypes.object,
};

// eslint-disable-next-line import/prefer-default-export
export { BannerMessage };
