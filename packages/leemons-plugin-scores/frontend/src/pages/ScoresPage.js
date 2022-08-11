import React from 'react';
import { Box, createStyles } from '@bubbles-ui/components';
import PeriodSelector from '@scores/components/PeriodSelector/PeriodSelector';
import Notebook from '@scores/components/Notebook';
import { usePeriods } from '@scores/hooks';
import { omitBy, isNil, isEqual } from 'lodash';

const useStyles = createStyles((theme) => ({
  root: { display: 'flex', flexDirection: 'row' },
}));

export default function ScoresPage() {
  /*
    --- Style ---
  */
  const { classes } = useStyles();

  /*
    --- State ---
  */
  const [isOpened, setIsOpened] = React.useState(true);
  const [periodFetchingFilters, setPeriodFetchingFilters] = React.useState({});
  const [filters, setFilters] = React.useState({});

  const { data: periodsResponse } = usePeriods({
    page: 0,
    size: 9999,
    query: omitBy(periodFetchingFilters, isNil),
  });
  const periods = periodsResponse?.items;

  return (
    <Box className={classes.root}>
      <PeriodSelector
        fields={{
          class: true,
        }}
        requiredFields={['program', 'course', 'subject', 'group']}
        fixed
        opened={isOpened}
        periods={periods || []}
        onPeriodChange={(v) => {
          if (
            v.program !== periodFetchingFilters.program ||
            v.course !== periodFetchingFilters.course
          ) {
            setPeriodFetchingFilters({
              program: v.program,
            });
          }
        }}
        onPeriodSubmit={(v) => {
          if (!isEqual(v, filters)) {
            setFilters(v);
          }
        }}
      />
      <Notebook isOpened={isOpened} onOpenChange={setIsOpened} filters={filters} />
    </Box>
  );
}
