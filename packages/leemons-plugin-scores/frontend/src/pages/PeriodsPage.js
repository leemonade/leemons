import React, { useMemo } from 'react';
import { Box, createStyles } from '@bubbles-ui/components';
import PeriodSelector from '@scores/components/PeriodSelector/PeriodSelector';
import PeriodList from '@scores/components/PeriodList/PeriodList';
import { useLocale, unflatten } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { usePeriodMutation } from '@scores/hooks';
import _, { isFunction } from 'lodash';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';

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

  const [, translations] = useTranslateLoader(prefixPN('periods.alerts'));

  const labels = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = _.get(res, prefixPN('periods.alerts'));

      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return data;
    }

    return {};
  }, [translations]);

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
