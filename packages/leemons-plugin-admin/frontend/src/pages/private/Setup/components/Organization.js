/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, ContextContainer, createStyles, Stack } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@admin/helpers/prefixPN';
import { useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { useLayout } from '@layout/context';
import { useForm } from 'react-hook-form';
import { addErrorAlert } from '@layout/alert';

const Styles = createStyles((theme) => ({}));

const Organization = ({ onNextLabel, onNext = () => {} }) => {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('setup.organization'));
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const { openDeleteConfirmationModal } = useLayout();
  const form = useForm();

  const [store, render] = useStore({
    loading: true,
    selectedCenter: null,
  });

  async function load() {
    try {
      store.loading = true;
      render();
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.loading = false;
    render();
  }

  React.useEffect(() => {
    load();
  }, []);

  const { classes: styles, cx } = Styles();

  return (
    <Box>
      <ContextContainer title={t('title')} description={t('description')} divided>
        <Box></Box>
        <Stack justifyContent="end">
          <Button onClick={onNext} loading={store.saving}>
            {onNextLabel}
          </Button>
        </Stack>
      </ContextContainer>
    </Box>
  );
};

Organization.defaultProps = {
  onNextLabel: 'Save and continue',
};
Organization.propTypes = {
  onNext: PropTypes.func,
  onNextLabel: PropTypes.string,
};

export { Organization };
export default Organization;
