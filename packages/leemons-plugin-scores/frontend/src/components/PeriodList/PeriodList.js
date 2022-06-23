import React from 'react';
import { map, slice, uniq } from 'lodash';
import { Box, PaginatedList } from '@bubbles-ui/components';
import { LocaleDate } from '@common';
import { useUserCenters } from '@users/hooks';
import { useCenterPrograms, useProgramDetail } from '@academic-portfolio/hooks';

export default function PeriodList({ periods }) {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Center',
        accessor: 'center',
      },
      {
        Header: 'Program',
        accessor: 'program',
      },
      {
        Header: 'Course',
        accessor: 'course',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Start Date',
        accessor: 'startDate',
      },
      {
        Header: 'End Date',
        accessor: 'endDate',
      },
    ],
    []
  );

  const page = 1;
  const size = 10;

  const periodsInPage = React.useMemo(
    () => slice(periods, (page - 1) * size, page * size),
    [periods, page, size]
  );
  const programsIds = React.useMemo(() => uniq(map(periodsInPage, 'program')), [periods]);

  const centers = useUserCenters();
  const programs = useProgramDetail(programsIds);

  const items = React.useMemo(
    () =>
      slice(periods, (page - 1) * size, page * size).map((period) => {
        const center = centers.data?.find((c) => c.id === period.center);
        const program = programs.find((p) => p.data?.id === period.program)?.data;
        const course = program?.courses?.find((c) => c.id === period.course);

        return {
          ...period,
          center: center?.name,
          program: program?.name,
          course: course?.name || course?.index || '-',
          startDate: <LocaleDate date={period.startDate} />,
          endDate: <LocaleDate date={period.endDate} />,
        };
      }),
    [periods, page, size, centers.data, ...map(programs, 'data')]
  );

  return (
    <Box>
      <PaginatedList
        items={items}
        columns={columns}
        page={page}
        size={size}
        totalCount={periods.length}
        totalPages={periods.length / size}
      />
    </Box>
  );
}
