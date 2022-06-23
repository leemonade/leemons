import React from 'react';
import { Box, Button, createStyles } from '@bubbles-ui/components';
import PeriodSelector from '@scores/components/PeriodSelector/PeriodSelector';
import PeriodList from '@scores/components/PeriodList/PeriodList';
import { useLocale } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { usePeriodMutation, usePeriods } from '@scores/hooks';

const useStyle = createStyles((theme) => ({
  root: {
    display: 'flex',
  },
}));

export default function PeriodsPage() {
  const { mutateAsync } = usePeriodMutation();
  const { data: periods } = usePeriods({
    page: 0,
    size: 9999,
    sort: 'center:ASC',
  });
  const { classes } = useStyle();
  const locale = useLocale();
  // const [periods, setPeriods] = React.useState([]);
  const [allowCreate, setAllowCreate] = React.useState(true);

  return (
    <Box className={classes.root}>
      <PeriodSelector
        opened
        allowCreate={allowCreate}
        periods={periods?.items || []}
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

          mutateAsync(period)
            .then(() => addSuccessAlert('Period added successfuly'))
            .catch((e) => addErrorAlert(`Error adding period: ${e.message}`));
        }}
        locale={locale}
        fields={{
          center: allowCreate ? 'all' : true,
          program: true,
          course: true,
          subject: !allowCreate,
          group: !allowCreate,
        }}
        requiredFields={
          allowCreate ? ['center', 'program'] : ['center', 'program', 'course', 'subject', 'group']
        }
      />
      <Box>
        <Button onClick={() => setAllowCreate((a) => !a)}>Toogle create</Button>

        <PeriodList periods={periods?.items || []} />
      </Box>
    </Box>
  );
}
