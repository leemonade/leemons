import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, Box, InputWrapper, Stack } from '@bubbles-ui/components';
import { Controller, useFormContext } from 'react-hook-form';
import ImagePicker from '@leebrary/components/ImagePicker';
import { Container } from '../Container';

export default function Presentation({ assignable, localizations, showTitle, showThumbnail }) {
  const { control } = useFormContext();

  if (!showTitle && !showThumbnail) {
    return null;
  }

  return (
    <Container title={localizations?.title} spacingBottom={16}>
      <Stack direction="column" spacing={5}>
        {!!showTitle && (
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Box sx={{ width: 366 }}>
                <TextInput
                  {...field}
                  label={localizations?.titleInput?.label}
                  placeholder={localizations?.titleInput?.placeholder}
                />
              </Box>
            )}
          />
        )}
        {!!showThumbnail && (
          <Controller
            name="thumbnail"
            control={control}
            defaultValue={assignable?.asset?.cover?.id ?? assignable?.asset?.cover}
            render={({ field }) => (
              <InputWrapper label={localizations?.thumbnail}>
                <ImagePicker {...field} isPickingACover />
              </InputWrapper>
            )}
          />
        )}
      </Stack>
    </Container>
  );
}

Presentation.propTypes = {
  assignable: PropTypes.shape({
    asset: PropTypes.shape({
      cover: PropTypes.string,
    }),
  }),
  localizations: PropTypes.object,
  showTitle: PropTypes.bool,
  showThumbnail: PropTypes.bool,
};
