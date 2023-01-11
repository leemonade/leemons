import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, ImageLoader, Loader, PaginatedList, Text } from '@bubbles-ui/components';
import _ from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useLayout } from '@layout/context';
import { useIsStudent, useIsTeacher } from '@academic-portfolio/hooks';
import { useHistory } from 'react-router-dom';
import { getSessionConfig } from '@users/session';
import searchOngoingActivities from '@assignables/requests/activities/searchOngoingActivities';
import useSearchOngoingActivities from '@assignables/requests/hooks/queries/useSearchOngoingActivities';
import useSearchAssignableInstances from '../../../../../hooks/assignableInstance/useSearchAssignableInstancesQuery';
import useParseAssignations from '../../hooks/useParseAssignations';
import useAssignationsByProfile from '../../../../../hooks/assignations/useAssignationsByProfile';
import prefixPN from '../../../../../helpers/prefixPN';
import EmptyState from '../../../../../assets/EmptyState.png';

function useAssignmentsColumns() {
  const isTeacher = useIsTeacher();
  const isStudent = useIsStudent();

  const [, translations] = useTranslateLoader(
    prefixPN(`assignment_list.${isTeacher ? 'teacher' : 'student'}`)
  );

  const labels = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = _.get(res, prefixPN(`assignment_list.${isTeacher ? 'teacher' : 'student'}`));

      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return data;
    }

    return {};
  }, [translations]);

  const teacherColumns = useMemo(
    () => [
      {
        Header: labels?.activity || '',
        accessor: 'activity',
      },
      {
        Header: labels?.subject || '',
        accessor: 'subject',
      },
      {
        Header: labels?.start || '',
        accessor: 'parsedDates.start',
      },
      {
        Header: labels?.deadline || '',
        accessor: 'parsedDates.deadline',
      },
      {
        Header: labels?.status || '',
        accessor: 'status',
      },
      {
        Header: labels?.completions || '',
        accessor: 'completion',
      },
      {
        Header: labels?.evaluated || '',
        accessor: 'evaluated',
      },
      {
        Header: labels.messages || '',
        accessor: 'messages',
      },
    ],
    [labels]
  );

  const studentColumns = useMemo(
    () => [
      {
        Header: labels?.activity || '',
        accessor: 'activity',
      },
      {
        Header: labels?.subject || '',
        accessor: 'subject',
      },
      {
        Header: labels?.start || '',
        accessor: 'parsedDates.start',
      },
      {
        Header: labels?.deadline || '',
        accessor: 'parsedDates.deadline',
      },
      {
        Header: labels?.status || '',
        accessor: 'status',
      },
      {
        Header: labels?.progress || '',
        accessor: 'progress',
      },
      {
        Header: labels.messages || '',
        accessor: 'messages',
      },
    ],
    [labels]
  );

  if (isTeacher) {
    return teacherColumns;
  }

  if (isStudent) {
    return studentColumns;
  }

  return [];
}

function useOngoingQuery(filters) {
  const sessionConfig = getSessionConfig();
  const isStudent = useIsStudent();

  const query = useMemo(() => {
    const q = {};

    if (filters?.query) {
      q.query = filters?.query;
    }

    if (filters?.type && filters?.type !== 'all') {
      q.role = filters?.type;
    }

    if (filters?.subject && filters?.subject !== 'all') {
      q.subjects = JSON.stringify([filters?.subject]);
    }

    if (filters?.program && filters?.program !== 'all') {
      q.programs = JSON.stringify([filters?.program]);
    } else if (isStudent && sessionConfig?.program) {
      q.programs = JSON.stringify([sessionConfig.program]);
    }

    if (filters?.class && filters?.class !== 'all') {
      q.classes = JSON.stringify([filters?.class]);
    }

    if (filters?.isArchived) {
      q.isArchived = true;
    } else {
      q.isArchived = false;
    }

    if (filters?.status && filters?.status !== 'all') {
      q.status = filters?.status;
    }

    if (filters?.progress && filters?.progress !== 'all') {
      q.progress = filters?.progress;
    }

    if (filters?.sort) {
      q.sort = filters?.sort;
    }

    return q;
  }, [filters, sessionConfig?.program, isStudent]);

  return query;
}

function useOngoingLocalizations() {
  const [, translations] = useTranslateLoader([
    prefixPN('pagination'),
    prefixPN('activities_list'),
  ]);

  const labels = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      return {
        pagination: _.get(res, prefixPN('pagination')),
        activitiesList: _.get(res, prefixPN('activities_list')),
      };
    }

    return {};
  }, [translations]);

  return labels;
}

function useOngoingData({ query, page, size, subjectFullLength }) {
  const { data: paginatedInstances, isLoading: instancesLoading } = useSearchOngoingActivities({
    ...query,
    offset: (page - 1) * size,
    limit: size,
  });

  const instances = paginatedInstances?.items;

  const assignationsByProfile = useAssignationsByProfile(instances || []);

  const instancesDataLoading = useMemo(
    () => assignationsByProfile.some((q) => q.isLoading),
    [assignationsByProfile]
  );

  const instancesData = useMemo(() => {
    if (instancesDataLoading) {
      return [];
    }

    return assignationsByProfile.map(({ data }) => data);
  }, [assignationsByProfile, instancesDataLoading]);

  const { data: parsedInstances, isLoading: parsedInstancesLoading } = useParseAssignations(
    instancesData,
    {
      subjectFullLength,
    }
  );

  const isLoading = instancesLoading || instancesDataLoading || parsedInstancesLoading;

  return {
    parsedInstances,
    isLoading,
    totalCount: paginatedInstances?.totalCount,
    totalPages: Math.ceil(paginatedInstances?.totalCount / size),
  };
}

export default function ActivitiesList({ filters, subjectFullLength = true }) {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const { theme: themeLayout } = useLayout();
  const history = useHistory();

  const query = useOngoingQuery(filters);
  const labels = useOngoingLocalizations();

  const { parsedInstances, isLoading, totalCount, totalPages } = useOngoingData({
    query,
    page,
    size,
    subjectFullLength,
  });

  const columns = useAssignmentsColumns();

  if (isLoading) {
    return <Loader />;
  }
  if (!parsedInstances?.length) {
    return (
      <Box
        sx={(theme) => ({
          width: '100%',
          height: 328,
          borderRadius: theme.spacing[1],
          backgroundColor: theme.colors.uiBackground02,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: theme.spacing[1],
        })}
      >
        {themeLayout.usePicturesEmptyStates && (
          <ImageLoader src={EmptyState} width={142} height={149} />
        )}
        <Text color="primary">{labels.activitiesList?.emptyState}</Text>
      </Box>
    );
  }

  const headerStyles = {
    position: 'sticky',
    top: '0px',
    backgroundColor: 'white',
    zIndex: 10,
  };

  return (
    <>
      <PaginatedList
        columns={columns}
        items={parsedInstances}
        page={page}
        size={size}
        loading={isLoading}
        totalCount={totalCount}
        totalPages={totalPages}
        onSizeChange={setSize}
        onPageChange={setPage}
        selectable
        onSelect={({ dashboardURL }) => {
          if (typeof dashboardURL === 'function') {
            window.open(dashboardURL());
          } else {
            window.open(dashboardURL);
          }
        }}
        labels={labels.pagination}
        headerStyles={headerStyles}
      />
    </>
  );
}

ActivitiesList.propTypes = {
  query: PropTypes.object,
};
