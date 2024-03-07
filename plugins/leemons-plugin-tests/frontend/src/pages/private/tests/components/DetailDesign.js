import React from 'react';
import PropTypes from 'prop-types';
import { Button, ContextContainer, Stack } from '@bubbles-ui/components';

export default function DetailDesign({ form, t, onNext }) {
  async function next() {
    const formGood = await form.trigger([]);
    if (formGood) {
      onNext();
    }
  }

  return (
    <ContextContainer>
      <Stack justifyContent="end">
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
