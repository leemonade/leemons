import React from 'react';
import PropTypes from 'prop-types';
import { Button, ContextContainer, Stack } from '@bubbles-ui/components';

export default function DetailDesign({ form, t, store, render, onNext }) {
  function next() {
    form.handleSubmit(() => {
      onNext();
    })();
  }

  React.useEffect(() => {
    // eslint-disable-next-line no-param-reassign
    store.activeStep = 'design';
    render();
  }, []);

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
  onNext: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
  render: PropTypes.func.isRequired,
};
