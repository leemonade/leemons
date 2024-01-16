import React from 'react';
import PropTypes from 'prop-types';
import { Box, HtmlText, InputWrapper, Radio, Stack, ListItem } from '@bubbles-ui/components';
import { ViewOffIcon } from '@bubbles-ui/icons/outline';
import ImagePicker from '@leebrary/components/ImagePicker';

// eslint-disable-next-line import/prefer-default-export
export function ListItemRender({
  item,
  t,
  useExplanation,
  withImages,
  changeCorrectResponse,
  toggleHideOnHelp,
  showEye,
  canSetHelp,
}) {
  return (
    <Box sx={(theme) => ({ width: '100%' })}>
      <Radio checked={item.isCorrectResponse} onChange={() => changeCorrectResponse(item)} />
      {JSON.stringify(item)}
    </Box>
  );
}

ListItemRender.propTypes = {
  canSetHelp: PropTypes.bool,
  item: PropTypes.object,
  t: PropTypes.func,
  useExplanation: PropTypes.bool,
  withImages: PropTypes.bool,
  toggleHideOnHelp: PropTypes.func,
  changeCorrectResponse: PropTypes.func,
  showEye: PropTypes.bool,
};
