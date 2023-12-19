import React from 'react';
import PropTypes from 'prop-types';
import { TextInput } from '@bubbles-ui/components';
import { Controller, useFormContext } from 'react-hook-form';
import { Container } from '../Container';

export default function Title({ localizations, showTitle, showThumbnail, ...field }) {
  const { control } = useFormContext();

  if (!showTitle && !showThumbnail) {
    return null;
  }

  return (
    <Container title={localizations?.title}>
      {!!showTitle && (
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              label={localizations?.titleInput?.label}
              placeholder={localizations?.titleInput?.placeholder}
            />
          )}
        />
      )}
    </Container>
  );
}

Title.propTypes = {};
