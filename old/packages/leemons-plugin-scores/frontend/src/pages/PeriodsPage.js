import React, { useMemo } from 'react';
import { Box, createStyles } from '@bubbles-ui/components';
import PeriodSelector from '@scores/components/PeriodSelector/PeriodSelector';
import PeriodList from '@scores/components/PeriodList/PeriodList';
import { useLocale, unflatten } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { usePeriodMutation } from '@scores/requests/hooks/mutations';
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
  const { mutate } = usePeriodMutation();

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

          mutate(
            { period },
            {
              onSuccess: () => addSuccessAlert(labels.addSuccess?.replace('{{name}}', name)),
              onError: (e) =>
                addErrorAlert(
                  labels.addError?.replace('{{name}}', name)?.replace('{{error}}', e.message)
                ),
            }
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
          mutate(
            { period, action: 'remove' },
            {
              onSuccess: (result) => {
                addSuccessAlert(labels.removeSuccess?.replace('{{name}}', period.name));
                if (isFunction(onSuccess)) {
                  onSuccess(result);
                }
              },
              onError: (e) => {
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
              },
            }
          )
        }
      />
    </Box>
  );
}
