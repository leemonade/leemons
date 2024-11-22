import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Menu, Box, Text } from '@bubbles-ui/components';
import { DeleteBinIcon, RemoveCircleIcon } from '@bubbles-ui/icons/outline';
import { SettingMenuVerticalIcon, ArchiveIcon } from '@bubbles-ui/icons/solid';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

import { MenuItemsStyles } from './MenuItems.styles';

import prefixPN from '@assignables/helpers/prefixPN';
import useMutateAssignableInstance from '@assignables/hooks/assignableInstance/useMutateAssignableInstance';
import useDeleteInstanceMutation from '@assignables/requests/hooks/mutations/useDeleteInstance';

function onCloseTask({
  instance,
  t,
  mutateAsyncAssignableInstance,
  closed,
  openConfirmationModal,
}) {
  return async () => {
    return openConfirmationModal({
      title: t('closeModal.title'),
      description: (
        <Box
          sx={(theme) => ({
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing[2],
          })}
        >
          <Text>{t('closeModal.message1')}</Text>
          <Text>{t('closeModal.message2')}</Text>
        </Box>
      ),
      labels: {
        confirm: t('closeModal.confirm'),
        cancel: t('closeModal.cancel'),
      },
      onConfirm: async () => {
        const newDates = {
          closed: new Date(),
        };

        if (dayjs(instance.dates.close).isBefore(dayjs())) {
          newDates.close = null;
        }

        try {
          await mutateAsyncAssignableInstance({ id: instance.id, dates: newDates });
          addSuccessAlert(t('closeActionAlerts.success'));
        } catch (e) {
          addErrorAlert(t('closeActionAlerts.error').replace('{{error}}', e.message));
        }
      },
    })();
  };
}

function archiveTask({ mutateAsyncAssignableInstance, instance, t }) {
  return async () => {
    const newDates = {
      archived: new Date(),
      closed: !instance.dates.deadline ? new Date() : undefined,
    };

    try {
      await mutateAsyncAssignableInstance({ id: instance.id, dates: newDates });
      addSuccessAlert(t('archiveActionAlerts.success'));
    } catch (e) {
      addErrorAlert(t('archiveActionAlerts.error').replace('{{error}}', e.message));
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
}) {
  return async () => {
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
            archiveTask({ mutateAsyncAssignableInstance, instance, t })();
          },
          onCancel: () => {
            setArchived(false);
          },
        })();
      }
    }
    return archiveTask({ mutateAsyncAssignableInstance, instance, t })();
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
    // !hiddenCloseButtons &&
    //   (alwaysAvailable || !deadlinePassed) &&
    //   !archived && {
    //     icon: closed ? <CheckCircleIcon /> : <RemoveCircleIcon />,
    //     children: closed ? t('opened') : t('close'),
    //     onClick: onCloseTask({ instance, t, mutateAsyncAssignableInstance, closed: !closed }),
    //     className: classes.menuItem,
    //   },
    !hiddenCloseButtons &&
      (alwaysAvailable || !deadlinePassed) &&
      !archived &&
      !closed && {
        icon: <RemoveCircleIcon />,
        children: t('close'),
        onClick: onCloseTask({
          instance,
          t,
          mutateAsyncAssignableInstance,
          closed: false,
          openConfirmationModal,
        }),
        className: classes.menuItem,
      },
    // !hiddenCloseButtons &&
    //   (alwaysAvailable || deadlinePassed || closed) && {
    //     icon: archived ? <UnarchiveIcon /> : <ArchiveIcon />,
    //     children: archived ? t('unarchive') : t('archive'),
    //     onClick: onArchiveTask({
    //       instance,
    //       subjects: instance?.subjects ?? [],
    //       setArchived,
    //       t,
    //       openConfirmationModal,
    //       mutateAsyncAssignableInstance,
    //     }),
    //     className: classes.menuItem,
    //   },
    !hiddenCloseButtons &&
      !archived &&
      closed &&
      (alwaysAvailable || deadlinePassed) && {
        icon: <ArchiveIcon />,
        children: t('archive'),
        onClick: onArchiveTask({
          instance,
          subjects: instance?.subjects ?? [],
          setArchived,
          t,
          openConfirmationModal,
          mutateAsyncAssignableInstance,
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
