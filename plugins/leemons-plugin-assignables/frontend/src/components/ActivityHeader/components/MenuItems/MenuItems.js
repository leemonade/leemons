import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Menu, Box, Text } from '@bubbles-ui/components';
import { CheckCircleIcon, DeleteBinIcon, RemoveCircleIcon } from '@bubbles-ui/icons/outline';
import { SettingMenuVerticalIcon, UnarchiveIcon, ArchiveIcon } from '@bubbles-ui/icons/solid';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

import { MenuItemsStyles } from './MenuItems.styles';

import prefixPN from '@assignables/helpers/prefixPN';
import useMutateAssignableInstance from '@assignables/hooks/assignableInstance/useMutateAssignableInstance';
import useDeleteInstanceMutation from '@assignables/requests/hooks/mutations/useDeleteInstance';

function onCloseTask({ instance, t, mutateAsyncAssignableInstance, closed }) {
  return async () => {
    const newDates = {
      closed: closed ? new Date() : null,
    };

    if (dayjs(instance.dates.close).isBefore(dayjs())) {
      newDates.close = null;
    }

    try {
      await mutateAsyncAssignableInstance({ id: instance.id, dates: newDates });

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

function archiveTask({ mutateAsyncAssignableInstance, instance, t }) {
  return async (archivedValue) => {
    const newDates = {
      archived: archivedValue ? new Date() : null,
      closed: archivedValue && !instance.dates.deadline ? new Date() : undefined,
    };

    try {
      await mutateAsyncAssignableInstance({ id: instance.id, dates: newDates });

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
  mutateAsyncAssignableInstance,
  archivedValue,
}) {
  return async () => {
    if (!archivedValue) {
      return archiveTask({ mutateAsyncAssignableInstance, instance, t })(archivedValue);
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
            archiveTask({ mutateAsyncAssignableInstance, instance, t })(archivedValue);
          },
          onCancel: () => {
            setArchived(false);
          },
        })();
      }
    }
    return archiveTask({ mutateAsyncAssignableInstance, instance, t })(archivedValue);
  };
}

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

const MenuItems = ({ instance, hideDeleteButton, hiddenCloseButtons }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [archived, setArchived] = useState(false);

  const { classes } = MenuItemsStyles({ showMenu }, { name: 'MenuItems' });
  const [t] = useTranslateLoader(prefixPN('activity_dashboard'));
  const { mutateAsync } = useDeleteInstanceMutation();
  const { mutateAsync: mutateAsyncAssignableInstance } = useMutateAssignableInstance();
  const { openConfirmationModal } = useLayout();
  const history = useHistory();

  const alwaysAvailable = !!instance?.alwaysAvailable;
  const { deadline, closed, archived: archivedDate } = instance?.dates ?? {};
  const now = dayjs();
  const deadlinePassed = alwaysAvailable ? false : deadline && now.isAfter(deadline);

  useEffect(() => {
    setArchived(!!archivedDate);
  }, [archivedDate]);

  const preventPropagation = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const menuItems = [
    !hiddenCloseButtons &&
      (alwaysAvailable || !deadlinePassed) &&
      !archived && {
        icon: closed ? <CheckCircleIcon /> : <RemoveCircleIcon />,
        children: closed ? t('opened') : t('close'),
        onClick: onCloseTask({ instance, t, mutateAsyncAssignableInstance, closed: !closed }),
        className: classes.menuItem,
      },
    !hiddenCloseButtons &&
      (alwaysAvailable || deadlinePassed || closed) && {
        icon: archived ? <UnarchiveIcon /> : <ArchiveIcon />,
        children: archived ? t('unarchive') : t('archive'),
        onClick: onArchiveTask({
          instance,
          subjects: instance?.subjects ?? [],
          setArchived,
          t,
          openConfirmationModal,
          mutateAsyncAssignableInstance,
          archivedValue: !archived,
        }),
        className: classes.menuItem,
      },
    !hideDeleteButton && {
      icon: <DeleteBinIcon />,
      children: t('delete'),
      onClick: onDeleteActivity({
        instance,
        t,
        openConfirmationModal,
        mutateAsync,
        onSuccess: () => history.push('/private/assignables/ongoing'),
      }),
      className: classes.menuItem,
    },
  ];
  const menuItemsFiltered = menuItems.filter(Boolean);

  return (
    <Box className={classes.root}>
      <Menu
        opened={showMenu}
        onOpen={() => setShowMenu(true)}
        onClose={() => setShowMenu(false)}
        position="bottom-end"
        withinPortal={true}
        offset={4}
        control={
          <Box as="button" className={classes.ellipsisBox} onClick={preventPropagation}>
            <SettingMenuVerticalIcon width={16} height={16} className={classes.menuIcon} />
          </Box>
        }
        items={menuItemsFiltered}
      />
    </Box>
  );
};

MenuItems.propTypes = {
  instance: PropTypes.shape({
    dates: PropTypes.shape({
      deadline: PropTypes.instanceOf(Date),
      closed: PropTypes.instanceOf(Date),
      archived: PropTypes.instanceOf(Date),
    }),
    alwaysAvailable: PropTypes.bool,
    subjects: PropTypes.array,
    students: PropTypes.array,
    id: PropTypes.string.isRequired,
    requiresScoring: PropTypes.bool,
    allowFeedback: PropTypes.bool,
  }).isRequired,
  hideDeleteButton: PropTypes.bool,
  hiddenCloseButtons: PropTypes.bool,
};

export { MenuItems };
