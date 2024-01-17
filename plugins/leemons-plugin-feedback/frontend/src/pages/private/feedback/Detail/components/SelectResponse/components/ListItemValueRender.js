import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text, Stack, ImageLoader } from '@bubbles-ui/components';
import ImagePicker from '@leebrary/components/ImagePicker';
import { getFileUrl } from '@leebrary/helpers/prepareAsset';

// eslint-disable-next-line import/prefer-default-export
export function ListItemValueRender({ item, t, withImages }) {
  return (
    <Box sx={() => ({ width: '100%' })}>
      <Stack fullWidth alignItems="center">
        <Box>
          {withImages && item.image ? (
            <Stack fullWidth spacing={4} alignItems="center">
              <Box>
                <ImageLoader
                  src={getFileUrl(item.image)}
                  width={72}
                  height={52}
                  bordered
                  radius={4}
                />
              </Box>

              {item.imageDescription ? (
                <Box>
                  <Text color="primary">{item.imageDescription}</Text>
                </Box>
              ) : null}
            </Stack>
          ) : (
            item.response
          )}
        </Box>
      </Stack>
    </Box>
  );
}

ListItemValueRender.propTypes = {
  item: PropTypes.object,
  t: PropTypes.func,
  withImages: PropTypes.bool,
};
