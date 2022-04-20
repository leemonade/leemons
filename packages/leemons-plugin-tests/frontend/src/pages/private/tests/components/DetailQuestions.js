import React from 'react';
import PropTypes from 'prop-types';
import { Button, ContextContainer, Stack } from '@bubbles-ui/components';

export default function DetailQuestions({ form, t, onNext }) {
  function next() {
    form.handleSubmit(() => {
      onNext();
    })();
  }

  return (
    <ContextContainer>
      <Stack justifyContent="end">
        <Button onClick={next}>{t('continue')}</Button>
      </Stack>
    </ContextContainer>
  );
}

DetailQuestions.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};
