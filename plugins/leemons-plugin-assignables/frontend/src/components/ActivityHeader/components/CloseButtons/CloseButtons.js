import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Stack, Button, Switch, Box, Text } from '@bubbles-ui/components';
import dayjs from 'dayjs';
import useMutateAssignableInstance from '@assignables/hooks/assignableInstance/useMutateAssignableInstance';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';
import { useLayout } from '@layout/context';

function onCloseTask({ instance, t, mutateAsync }) {
  return async (closed) => {
    const newDates = {
      closed: closed ? new Date() : null,
    };

    if (dayjs(instance.dates.close).isBefore(dayjs())) {
      newDates.close = null;
    }

    try {
      await mutateAsync({ id: instance.id, dates: newDates });

      let verb = t('closeAction.verbs.closed');
      if (!closed) {
        verb = t('closeAction.verbs.opened');
      }
      addSuccessAlert(t('closeAction.messages.success').replace('{{verb}}', verb));
    } catch (e) {
      let verb = t('closeAction.verbs.closing');
      if (!closed) {
        verb = t('closeAction.verbs.opening');
      }
      addErrorAlert(
        t('closeAction.messages.error').replace('{{verb}}', verb).replace('{{error}}', e.message)
      );
    }
  };
}

function archiveTask({ mutateAsync, instance, t }) {
  return async (archivedValue) => {
    const newDates = {
      archived: archivedValue ? new Date() : null,
      // TODO: Do not close if not closable
      closed: archivedValue && !instance.dates.deadline ? new Date() : undefined,
    };

    try {
      await mutateAsync({ id: instance.id, dates: newDates });

      let verb = t('archiveAction.verbs.archived');
      if (!archivedValue) {
        verb = t('archiveAction.verbs.unarchived');
      }
      addSuccessAlert(t('archiveAction.messages.success').replace('{{verb}}', verb));
    } catch (e) {
      let verb = t('archiveAction.verbs.archiving');
      if (!archivedValue) {
        verb = t('archiveAction.verbs.unarchiving');
      }
      addErrorAlert(
        t('archiveAction.messages.error').replace('{{verb}}', verb).replace('{{error}}', e.message)
      );
    }
  };
}

function onArchiveTask({
  instance,
  subjects = [],
  setArchived,
  t,
  openConfirmationModal,
  mutateAsync,
}) {
  return async (archivedValue) => {
    if (!archivedValue) {
      return archiveTask({ mutateAsync, instance, t })(archivedValue);
    }

    if (instance.requiresScoring || instance.allowFeedback) {
      if (
        instance.students.some(
          (student) =>
            student.grades.filter((grade) => grade.type === 'main').length < subjects?.length
        )
      ) {
        setArchived(true);
        return openConfirmationModal({
          title: t('archiveModal.title'),
          description: (
            <Box
              sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing[2],
              })}
            >
              <Text>{t('archiveModal.message1')}</Text>
              <Text>{t('archiveModal.message2')}</Text>
            </Box>
          ),
          labels: {
            confirm: t('archiveModal.confirm'),
            cancel: t('archiveModal.cancel'),
          },
          onConfirm: () => {
            archiveTask({ mutateAsync, instance, t })(archivedValue);
          },
          onCancel: () => {
            setArchived(false);
          },
        })();
      }
    }
    return archiveTask({ mutateAsync, instance, t })(archivedValue);
  };
}

export default function CloseButtons({ instance, hidden }) {
  const [t] = useTranslateLoader(prefixPN('activity_dashboard'));
  const { mutateAsync } = useMutateAssignableInstance();
  const { openConfirmationModal } = useLayout();

  const alwaysAvailable = !!instance?.alwaysAvailable;
  const { deadline, closed, archived: archivedDate } = instance?.dates ?? {};

  const [archived, setArchived] = useState(false);

  useEffect(() => {
    setArchived(!!archivedDate);
  }, [archivedDate]);

  const now = dayjs();
  const deadlinePassed = alwaysAvailable ? false : deadline && now.isAfter(deadline);

  if (hidden || (!alwaysAvailable && !deadlinePassed && !closed && !archived)) {
    return null;
  }
  return (
    <Stack>
      <Switch
        label="Cerrar"
        disabled={!alwaysAvailable}
        checked={!!closed || !!deadlinePassed}
        onChange={onCloseTask({ instance, t, mutateAsync })}
      />
      <Switch
        label="Archivar"
        checked={!!archived}
        onChange={onArchiveTask({
          instance,
          t,
          openConfirmationModal,
          mutateAsync,
          setArchived,
          subjects: instance?.subjects ?? [],
        })}
      />
    </Stack>
  );
}

CloseButtons.propTypes = {};
