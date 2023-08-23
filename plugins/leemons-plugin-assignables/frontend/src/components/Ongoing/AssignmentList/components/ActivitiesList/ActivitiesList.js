import { useIsStudent, useIsTeacher } from '@academic-portfolio/hooks';
import useSearchOngoingActivities from '@assignables/requests/hooks/queries/useSearchOngoingActivities';
import { Box, ImageLoader, Loader, PaginatedList, Text } from '@bubbles-ui/components';
import { unflatten } from '@common';
import { addErrorAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { getSessionConfig } from '@users/session';
import _, { keyBy, uniq, without } from 'lodash';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import EmptyState from '../../../../../assets/EmptyState.png';
import prefixPN from '../../../../../helpers/prefixPN';
import useAssignationsByProfile from '../../../../../hooks/assignations/useAssignationsByProfile';
import useParseAssignations from '../../hooks/useParseAssignations';

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

function useBlockingActivitiesStatus(assignations) {
  const isStudent = useIsStudent();

  const assignationsById = {};

  const blockingIds = useMemo(() => {
    if (!isStudent) {
      return [];
    }

    const blocking = [];

    assignations.forEach((assignation) => {
      assignationsById[assignation.id] = {
        id: assignation.id,
        finished: !!assignation.timestamps.end,
      };

      const instanceBlocking = assignation.instance.relatedAssignableInstances?.blocking;
      if (instanceBlocking?.length) {
        blocking.push(...instanceBlocking);
      }
    });

    return uniq(blocking);
  }, [assignations]);

  const blockingIdsMissing = useMemo(
    () => without(blockingIds, ...Object.keys(assignationsById)),
    [blockingIds, assignationsById]
  );

  const { data, isLoading } = useAssignationsByProfile(blockingIdsMissing, {
    enabled: !!blockingIdsMissing.length,
    placeholderData: {},
    select: (instancesData) =>
      keyBy(
        instancesData.map((assignation) => ({
          id: assignation.instance.id,
          finished: !!assignation.timestamps.end,
        })),
        'id'
      ),
  });

  const dataToReturn = useMemo(() => ({ ...data, ...assignationsById }), [data, assignationsById]);

  return { data: dataToReturn, isLoading: blockingIdsMissing?.length ? isLoading : false };
}

function useOngoingData({ query, page, size, subjectFullLength }) {
  const { data: paginatedInstances, isLoading: instancesLoading } = useSearchOngoingActivities({
    ...query,
    offset: (page - 1) * size,
    limit: size,
  });

  const instances = paginatedInstances?.items ?? [];

  const originalOrder = useMemo(() => {
    const order = {};

    instances.forEach((instance, i) => {
      order[instance] = i;
    });

    return order;
  }, [instances]);

  const { isLoading: instancesDataLoading, data: instancesData } = useAssignationsByProfile(
    instances || [],
    {
      placeholderData: [],
    }
  );

  const orderedInstancesData = useMemo(() => {
    const sortedData = [];

    instancesData.forEach((instance) => {
      sortedData[originalOrder[instance.instance?.id || instance.id]] = instance;
    });

    return sortedData;
  }, [originalOrder, instancesData]);

  const { data: blockingActivities, isLoading: blockingActivitiesAreLoading } =
    useBlockingActivitiesStatus(orderedInstancesData);

  const { data: parsedInstances, isLoading: parsedInstancesLoading } = useParseAssignations(
    orderedInstancesData,
    {
      blockingActivities,
      subjectFullLength,
    }
  );

  const isLoading =
    instancesLoading ||
    instancesDataLoading ||
    parsedInstancesLoading ||
    blockingActivitiesAreLoading;

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
        onSelect={({ isBlocked, dashboardURL }) => {
          if (isBlocked) {
            addErrorAlert(labels?.activitiesList?.blocked);
          } else {
            const url = typeof dashboardURL === 'function' ? dashboardURL() : dashboardURL;
            if (url) {
              window.open(url, 'Dashboard', 'noopener');
            }
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
