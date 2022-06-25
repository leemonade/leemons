import React from 'react';
import { Box, createStyles } from '@bubbles-ui/components';
import PeriodSelector from '@scores/components/PeriodSelector/PeriodSelector';
import PeriodList from '@scores/components/PeriodList/PeriodList';
import { useLocale } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { usePeriodMutation, usePeriods } from '@scores/hooks';
import { isFunction } from 'lodash';

const useStyle = createStyles((theme) => ({
  root: {
    display: 'flex',
    gap: theme.spacing[11],
  },
}));

export default function PeriodsPage() {
  const { mutateAsync } = usePeriodMutation();

  const { classes } = useStyle();
  const locale = useLocale();

  const labels = {
    removeSuccess: 'Periodo "{{name}}" eliminado correctamente',
    removeError: 'Error eliminando el periodo "{{name}}": {{error}}',
    addSuccess: 'Periodo "{{name}}" añadido correctamente',
    addError: 'Error añadiendo el periodo "{{name}}": {{error}}',
  };

  return (
    <Box className={classes.root}>
      <PeriodSelector
        opened
        allowCreate
        onPeriodSave={(name, share, data) => {
          const period = {
            name,
            startDate: data.startDate,
            endDate: data.endDate,
            center: data.center,
            program: data.program,
            course: data.course,
            public: share,
          };

          mutateAsync({ period })
            .then(() => addSuccessAlert(labels.addSuccess?.replace('{{name}}', name)))
            .catch((e) =>
              addErrorAlert(
                labels.addError?.replace('{{name}}', name)?.replace('{{error}}', e.message)
              )
            );
        }}
        locale={locale}
        fields={{
          center: 'all',
          program: true,
          course: true,
        }}
        requiredFields={['center', 'program']}
      />

      <PeriodList
        onRemove={(period, onSuccess, onError) =>
          mutateAsync({ period, action: 'remove' })
            .then((result) => {
              addSuccessAlert(labels.removeSuccess?.replace('{{name}}', period.name));
              if (isFunction(onSuccess)) {
                onSuccess(result);
              }
            })
            .catch((e) => {
              addErrorAlert(
                labels.removeError
                  ?.replace('{{name}}', period.name)
                  .replace(
                    '{{error}}',
                    e?.error?.substring('Error removing period: '.length) || e.message
                  )
              );
              if (isFunction(onError)) {
                onError(e);
              }
            })
        }
      />
    </Box>
  );
}
