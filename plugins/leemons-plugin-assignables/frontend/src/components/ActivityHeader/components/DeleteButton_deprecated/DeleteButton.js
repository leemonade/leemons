import React from 'react';
import { useHistory } from 'react-router-dom';

import { Button, Box, Text } from '@bubbles-ui/components';
import { DeleteBinIcon } from '@bubbles-ui/icons/outline';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import prefixPN from '@assignables/helpers/prefixPN';
import useDeleteInstanceMutation from '@assignables/requests/hooks/mutations/useDeleteInstance';

function onDeleteActivity({ instance, t, openConfirmationModal, mutateAsync, onSuccess }) {
  return async () => {
    return openConfirmationModal({
      title: t('deleteModal.title'),
      description: (
        <Box
          sx={(theme) => ({
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing[2],
          })}
        >
          <Text>{t('deleteModal.message1')}</Text>
          <Text>{t('deleteModal.message2')}</Text>
        </Box>
      ),
      labels: {
        confirm: t('deleteModal.confirm'),
        cancel: t('deleteModal.cancel'),
      },
      onConfirm: async () => {
        try {
          await mutateAsync({ id: instance.id });
          addSuccessAlert(t('deleteAction.success'));
          onSuccess();
        } catch (e) {
          addErrorAlert(t('deleteAction.error').replace('{{error}}', e.message));
        }
      },
    })();
  };
}

export default function DeleteButton({ instance, hidden }) {
  const [t] = useTranslateLoader(prefixPN('activity_dashboard'));
  const { mutateAsync } = useDeleteInstanceMutation();
  const { openConfirmationModal } = useLayout();
  const history = useHistory();

  if (hidden) {
    return null;
  }

  return (
    <Box>
      <Button
        variant="link"
        leftIcon={<DeleteBinIcon />}
        onClick={onDeleteActivity({
          instance,
          t,
          openConfirmationModal,
          mutateAsync,
          onSuccess: () => history.push('/private/assignables/ongoing'),
        })}
      >
        {t('delete')}
      </Button>
    </Box>
  );
}

DeleteButton.propTypes = {
  instance: PropTypes.object.isRequired,
  hidden: PropTypes.bool,
};
