import React from 'react';
import PropTypes from 'prop-types';
import { Box, InputWrapper, Stack } from '@bubbles-ui/components';
import ImagePicker from '@leebrary/components/ImagePicker';

// eslint-disable-next-line import/prefer-default-export
export function ListItemValueRender({ item, t, withImages }) {
  return (
    <Box sx={() => ({ width: '100%' })}>
      <Stack fullWidth alignItems="start" justifyContent="start">
        <Box>
          {withImages ? (
            <>
              {item.image ? (
                <>
                  <Stack fullWidth spacing={4}>
                    <Box>
                      <ImagePicker value={item.image} readonly={true} />
                    </Box>
                    <Box>
                      <InputWrapper label={t('caption')}>{item.imageDescription}</InputWrapper>
                    </Box>
                  </Stack>
                </>
              ) : null}
            </>
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
