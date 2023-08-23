import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import _, { map, uniq, isFunction } from 'lodash';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  createStyles,
  PaginatedList,
  SearchInput,
  Select,
} from '@bubbles-ui/components';
import { LocaleDate, unflatten } from '@common';
import { useUserCenters } from '@users/hooks';
import { useCenterPrograms, useProgramDetail } from '@academic-portfolio/hooks';
import { DeleteBinIcon } from '@bubbles-ui/icons/solid';
import { usePeriods } from '@scores/requests/hooks/queries';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import getCourseName from '@academic-portfolio/helpers/getCourseName';

const useStyle = createStyles((theme) => ({
  paginatedList: {
    width: '100%',
    marginTop: theme.spacing[5],
    marginRight: theme.spacing[13],
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[7],
  },
  filters: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[7],
  },
  filtersTop: {
    width: 613,
  },
  filtersBot: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing[7],
  },
}));

function CenterAlignedSelect(props) {
  const { theme } = useStyle();
  return (
    <Select
      {...props}
      orientation="horizontal"
      style={{
        display: 'flex',
        flexDirecton: 'row',
        alignItems: 'center',
        gap: theme.spacing[4],
      }}
      headerStyle={{
        width: 'auto',
      }}
    />
  );
}
function PeriodFilters({ centers, programs, onChange }) {
  /*
    --- Form Handling ---
  */
  const { control, watch } = useForm({
    defaultValues: {
      search: '',
      center: null,
      program: null,
      course: null,
    },
  });

  const [, translations] = useTranslateLoader(prefixPN('periods.periodListFilters'));

  const labels = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = _.get(res, prefixPN('periods.periodListFilters'), {});

      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return data;
    }

    return {};
  }, [translations]);

  React.useEffect(() => {
    if (isFunction(onChange)) {
      let timer;
      const subscription = watch((v) => {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          onChange(v);
        }, 500);
      });

      return () => subscription.unsubscribe();
    }
  }, [onChange, watch]);
  /*
    --- Styles ---
  */
  const { classes } = useStyle();

  /*
      --- Render ---
    */
  return (
    <Box className={classes.filters}>
      <Box className={classes.filtersTop}>
        <Controller
          control={control}
          name="search"
          render={({ field }) => (
            <SearchInput placeholder={labels?.search} variant="filled" {...field} />
          )}
        />
      </Box>
      <Box className={classes.filtersBot}>
        <Controller
          name="center"
          control={control}
          render={({ field }) => <CenterSelect field={field} centers={centers} labels={labels} />}
        />
        <Controller
          name="program"
          control={control}
          render={({ field }) => (
            <ProgramSelect field={field} labels={labels} programs={programs} watch={watch} />
          )}
        />

        <Controller
          name="course"
          control={control}
          render={({ field }) => <CourseSelect field={field} watch={watch} labels={labels} />}
        />
      </Box>
    </Box>
  );
}

function PeriodActions({ period, onRemove }) {
  return (
    <Button
      iconOnly
      variant="link"
      color="primary"
      rightIcon={<DeleteBinIcon />}
      onClick={() => {
        if (isFunction(onRemove)) {
          onRemove(period);
        }
      }}
    />
  );
}

PeriodActions.propTypes = {
  period: PropTypes.object.isRequired,
  onRemove: PropTypes.func,
};

function CenterSelect({ field, centers, labels }) {
  const data = React.useMemo(
    () =>
      centers?.map((center) => ({
        label: center.name,
        value: center.id,
      })),
    [centers]
  );

  React.useEffect(() => {
    if (field.value && !data.some((d) => d.value === field.value)) {
      field.onChange(null);
    }
  }, [data]);

  return (
    <CenterAlignedSelect
      label={labels?.center}
      placeholder={labels?.centerPlaceholder}
      disabled={!centers?.length}
      data={data}
      clearable="clear"
      {...field}
    />
  );
}

function ProgramSelect({ field, watch, programs, labels }) {
  const center = watch('center');

  const programsMatchingCenter = React.useMemo(
    () => (!center ? programs : programs.filter((program) => program.centers.includes(center))),
    [center, programs]
  );

  const data = React.useMemo(
    () =>
      programsMatchingCenter.map((program) => ({
        label: program.name,
        value: program.id,
      })),
    [programsMatchingCenter]
  );

  React.useEffect(() => {
    if (field.value && !data.some((d) => d.value === field.value)) {
      field.onChange(null);
    }
  }, [data]);

  return (
    <CenterAlignedSelect
      label={labels?.program}
      placeholder={labels?.programPlaceholder}
      disabled={!data?.length}
      data={data}
      clearable="clear"
      {...field}
    />
  );
}

function CourseSelect({ field, watch, labels }) {
  const program = watch('program');

  const { data: programObj } = useProgramDetail(program, { enabled: !!program });

  const courses = React.useMemo(
    () =>
      programObj?.courses?.map((course) => ({
        label: getCourseName(course),
        value: course.id,
      })),
    [programObj]
  );

  React.useEffect(() => {
    if (field.value && !courses?.some((course) => course.value === field.value)) {
      field.onChange(null);
    }
  }, [courses]);

  return (
    <CenterAlignedSelect
      label={labels?.course}
      placeholder={labels?.coursePlaceholder}
      disabled={!programObj}
      data={courses}
      clearable="clear"
      {...field}
    />
  );
}

export default function PeriodList({ onRemove, className }) {
  /*
    --- Pagination ---
  */
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(10);

  /*
    --- Filters ---
  */
  const [filters, setFilters] = React.useState({});

  /*
    --- Table ---
  */

  const [, translations] = useTranslateLoader(prefixPN('periods.periodListColumns'));

  const columnLabels = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = _.get(res, prefixPN('periods.periodListColumns'), {});

      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return data;
    }

    return {};
  }, [translations]);

  const columns = React.useMemo(
    () => [
      {
        Header: columnLabels?.center || '',
        accessor: 'center',
      },
      {
        Header: columnLabels?.program || '',
        accessor: 'program',
      },
      {
        Header: columnLabels?.course || '',
        accessor: 'course',
      },
      {
        Header: columnLabels?.name || '',
        accessor: 'name',
      },
      {
        Header: columnLabels?.startDate || '',
        accessor: 'startDate',
      },
      {
        Header: columnLabels?.endDate || '',
        accessor: 'endDate',
      },
      {
        Header: '',
        accessor: 'actions',
      },
    ],
    [columnLabels]
  );

  /*
    --- Data fetching ---
  */

  const { data: centers } = useUserCenters();
  const programsByCenter = useCenterPrograms(map(centers, 'id'));
  const programs = React.useMemo(() => {
    const data = map(programsByCenter, 'data').filter(Boolean);

    return data.flat();
  }, [programsByCenter]);

  const { data: periods } = usePeriods({
    page: page - 1,
    size,
    sort: 'center:ASC,program:ASC,course:ASC,startDate:ASC,endDate:ASC,name:ASC,id:ASC',
    query: {
      center: filters.center || undefined,
      center_$in: JSON.stringify(map(centers, 'id')),
      program: filters.program || undefined,
      course: filters.course || undefined,
      name_$contains: filters.search || undefined,
    },
  });

  const programsToFetchDetails = React.useMemo(
    () => uniq(map(periods?.items || [], 'program')),
    [periods?.items]
  );
  const programDetails = useProgramDetail(programsToFetchDetails, {
    enabled: programsToFetchDetails?.length > 0,
  });

  const courses = React.useMemo(() => {
    const programsData = map(programDetails, 'data').filter(Boolean);
    return map(programsData, 'courses').flat();
  }, [programDetails]);

  /*
    --- Table Formatting ---
  */
  const items = React.useMemo(
    () =>
      (periods?.items || []).map((period) => {
        const center = centers?.find((c) => c.id === period.center);
        const program = programs.find((p) => p.id === period.program);
        const course = courses?.find((c) => c.id === period.course);

        return {
          ...period,
          center: center?.name,
          program: program?.name,
          course: course ? getCourseName(course) : '-',
          startDate: <LocaleDate date={period.startDate} />,
          endDate: <LocaleDate date={period.endDate} />,
          actions: <PeriodActions period={period} onRemove={onRemove} />,
        };
      }),
    [periods, page, size, centers, programs]
  );

  /*
    --- Styles ---
  */
  const { classes, cx } = useStyle();

  /*
    --- Render ---
  */
  return (
    <Box className={cx(classes.paginatedList, className)}>
      <PeriodFilters centers={centers} programs={programs} onChange={setFilters} />
      <PaginatedList
        items={items}
        columns={columns}
        page={page}
        size={size}
        totalCount={periods?.totalCount || 0}
        totalPages={periods?.TotalPages || 0}
        onPageChange={setPage}
        onSizeChange={setSize}
      />
    </Box>
  );
}

PeriodList.propTypes = {
  periods: PropTypes.array.isRequired,
  onRemove: PropTypes.func,
};
