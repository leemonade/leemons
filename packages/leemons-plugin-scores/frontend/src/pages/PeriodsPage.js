import React from 'react';
import { Box, Button } from '@bubbles-ui/components';
import PeriodSelector from '@scores/components/PeriodSelector/PeriodSelector';
import PeriodList from '@scores/components/PeriodList/PeriodList';
import { useLocale } from '@common';

export default function PeriodsPage() {
  const locale = useLocale();
  const [periods, setPeriods] = React.useState([]);
  const [allowCreate, setAllowCreate] = React.useState(true);

  return (
    <Box>
      <Button onClick={() => setAllowCreate((a) => !a)}>Toogle create</Button>
      <PeriodSelector
        opened
        allowCreate={allowCreate}
        periods={periods}
        onPeriodSave={(name, share, data) => {
          setPeriods([
            ...periods,
            {
              name,
              startDate: data.startDate,
              endDate: data.endDate,
            },
          ]);
        }}
        locale={locale}
      />
      <PeriodList />
    </Box>
  );
}
