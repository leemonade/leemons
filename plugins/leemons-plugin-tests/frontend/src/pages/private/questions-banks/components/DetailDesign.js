import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, ContextContainer, InputWrapper, Stack } from '@bubbles-ui/components';
import { Controller } from 'react-hook-form';
import ImagePicker from '@leebrary/components/ImagePicker';

export default function DetailDesign({ form, t, onNext }) {
  const [isDirty, setIsDirty] = React.useState(false);

  async function next() {
    setIsDirty(true);
    const formGood = await form.trigger(['cover']);
    if (formGood) {
      onNext();
    }
  }

  return (
    <ContextContainer>
      <Stack justifyContent="space-between">
        <Box sx={(theme) => ({ marginRight: theme.spacing[8] })}>
          <InputWrapper
            label={t('coverImage')}
            error={isDirty ? form.formState.errors.cover : null}
          >
            <Controller
              control={form.control}
              name="cover"
              render={({ field }) => <ImagePicker {...field} />}
            />
          </InputWrapper>
        </Box>
        <Button onClick={next}>{t('continue')}</Button>
      </Stack>
    </ContextContainer>
  );
}

DetailDesign.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onNext: PropTypes.func,
};
