import React from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Title } from '@bubbles-ui/components';
import { ViewOffIcon } from '@bubbles-ui/icons/solid';
import { numberToEncodedLetter } from '@common';

// eslint-disable-next-line import/prefer-default-export
export function ListItemValueRender({ item, markers, showEye, index }) {
  return (
    <Box sx={() => ({ width: '100%' })}>
      <Stack fullWidth alignItems="center">
        <Box
          sx={(theme) => ({
            marginRight: theme.spacing[5],
          })}
        >
          <Title order={6}>
            {markers.type === 'letter' ? numberToEncodedLetter(index + 1) : index + 1}
          </Title>
        </Box>
        {showEye && markers?.list?.[index]?.hideOnHelp ? (
          <Box
            sx={(theme) => ({
              marginRight: theme.spacing[5],
              marginTop: theme.spacing[1],
              color: theme.other.global.content.color.icon.default,
            })}
          >
            <ViewOffIcon width={18} height={18} />
          </Box>
        ) : null}

        <Box>{item.response}</Box>
      </Stack>
    </Box>
  );
}

ListItemValueRender.propTypes = {
  canSetHelp: PropTypes.bool,
  item: PropTypes.object,
  toggleHideOnHelp: PropTypes.func,
  index: PropTypes.number,
  markers: PropTypes.object,
  showEye: PropTypes.bool,
};
