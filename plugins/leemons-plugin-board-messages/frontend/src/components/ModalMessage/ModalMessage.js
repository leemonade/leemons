import React from 'react';

import { Box, Button, ImageLoader, Stack } from '@bubbles-ui/components';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import PropTypes from 'prop-types';

import { ModalMessageStyles } from './ModalMessage.styles';

import { addClickRequest } from '@board-messages/request';

const ModalMessage = ({ message, onClose }) => {
  const preparedAsset = prepareAsset(message.asset || {});
  const { t: tCommon } = useCommonTranslate('page_header');

  const openLink = () => {
    addClickRequest(message.id);
    window.open(message.url, '_blank', 'noopener');
  };

  const stringToHTML = (str) => ({ __html: str });

  const { classes } = ModalMessageStyles({}, { name: 'ModalMessage' });
  return (
    <Box className={classes.root}>
      {message.asset?.cover && (
        <Box>
          <ImageLoader src={preparedAsset?.cover} width={'100%'} height={200} />
        </Box>
      )}
      <Box className={classes.title}>{message.internalName}</Box>
      <Box className={classes.message} dangerouslySetInnerHTML={stringToHTML(message.message)} />
      <Stack justifyContent="space-between" mt={16}>
        <Box className={classes.buttonRow}>
          <Button variant="outline" onClick={onClose}>
            {tCommon('close')}
          </Button>
        </Box>
        {message.url && (
          <Box className={classes.link}>
            <Button onClick={openLink}>{message.textUrl}</Button>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

ModalMessage.propTypes = {
  message: PropTypes.object,
  onClose: PropTypes.func,
};

// eslint-disable-next-line import/prefer-default-export
export { ModalMessage };
