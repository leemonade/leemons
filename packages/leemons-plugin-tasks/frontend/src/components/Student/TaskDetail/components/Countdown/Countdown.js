import React, { useMemo, useEffect } from 'react';
import { ActivityCountdown, createStyles, Box, getFontProductive } from '@bubbles-ui/components';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';

import { useLayout } from '@layout/context';

const useStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing[6],
    marginRight: theme.spacing[5],
  },
  countdown: {
    backgroundColor: theme.colors.uiBackground02,
    width: 210,
    height: 60,
    borderRadius: theme.spacing[2],
  },
}));

dayjs.extend(dayjsDuration);

const useCountdownDate = (assignation) =>
  useMemo(() => {
    const instance = assignation?.instance;
    const startDate = dayjs(assignation?.timestamps?.start || null);
    // const deadline = dayjs(instance?.dates?.deadline || null);
    const [durationValue, durationUnits] = instance?.duration?.split(' ') || [];

    if (!startDate.isValid() || !durationValue || !durationUnits) {
      return null;
    }
    const duration = dayjs.duration({ [durationUnits]: durationValue });
    const endDate = startDate.add(duration.asSeconds(), 'seconds');

    // if (deadline.isValid() && deadline.isBefore(endDate)) {
    //   endDate = deadline;
    // }

    if (!endDate.isValid()) {
      return null;
    }

    return endDate;
  }, [assignation]);

export default function Countdown({ assignation, show = true, onTimeout }) {
  const { classes } = useStyles();
  const { openConfirmationModal, openDeleteConfirmationModal } = useLayout();
  const opened = React.useRef(false);
  const history = useHistory();

  const labels = {
    title: 'El tiempo establecido para completar esta actividad ha finalizado.',
    description:
      'Si has guardado algún archivo previamente, ha sido enviado automáticamente, en caso contrario, no se ha efectuado ninguna entrega.\nPuedes revisar la entrega pulsando en "Revisar entrega" o visitar la sección de Actividades en curso',
    confirm: 'Revisar entrega',
    cancel: 'Actividades en curso',
  };
  const showTimeoutModal = useMemo(
    () =>
      openConfirmationModal({
        title: labels.title,
        description: labels.description,
        labels: {
          confirm: labels.confirm,
          cancel: labels.cancel,
        },
        onConfirm: () => {
          const role = assignation?.instance?.assignable?.roleDetails;
          const revisionUrl = role.evaluationDetailUrl
            .replace(':id', assignation?.instance?.id)
            .replace(':user', assignation?.user);
          history.push(revisionUrl);
        },
        onCancel: () => {
          history.push('/private/assignables/ongoing');
        },
      }),
    [history]
  );

  const endDate = useCountdownDate(assignation);

  useEffect(() => {
    if (endDate?.isValid() && !opened.current) {
      const timeUntilEnd = endDate?.diff(dayjs(), 'millisecond');

      if (timeUntilEnd <= 0) {
        onTimeout?.();
        showTimeoutModal();
        opened.current = true;
      } else {
        const timer = setTimeout(() => {
          onTimeout?.();
          showTimeoutModal();
          opened.current = true;
        }, timeUntilEnd);

        return () => clearTimeout(timer);
      }
    }
  }, [endDate?.format(), showTimeoutModal]);

  if (!endDate || !show) {
    return null;
  }

  return (
    <Box className={classes?.root}>
      <Box className={classes.countdown}>
        <ActivityCountdown finish={endDate.toDate()} />
      </Box>
    </Box>
  );
}
