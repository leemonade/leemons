import React, { useMemo, useState } from 'react';

import { useIsStudent, useIsTeacher } from '@academic-portfolio/hooks';
import { Box, ImageLoader, Loader, PaginatedList, Stack, Text } from '@bubbles-ui/components';
import { PluginComunicaIcon } from '@bubbles-ui/icons/outline';
import { unflatten } from '@common';
import { addErrorAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { getSessionConfig } from '@users/session';
import _ from 'lodash';
import PropTypes from 'prop-types';

import EmptyState from '../../../../../assets/EmptyState.png';
import prefixPN from '../../../../../helpers/prefixPN';
import useAssignationsByProfile from '../../../../../hooks/assignations/useAssignationsByProfile';
import useParseAssignations from '../../hooks/useParseAssignations';

import useSearchOngoingActivities from '@assignables/requests/hooks/queries/useSearchOngoingActivities';

function useAssignmentsColumns({ archived }) {
  const isTeacher = useIsTeacher();
  const isStudent = useIsStudent();

  const [, translations] = useTranslateLoader(
    prefixPN(`assignment_list.${isTeacher ? 'teacher' : 'student'}`)
  );

  const labels = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return _.get(res, prefixPN(`assignment_list.${isTeacher ? 'teacher' : 'student'}`));
    }

    return {};
  }, [translations]);

  const teacherColumns = useMemo(
    () =>
      [
        {
          Header: labels?.activity || '',
          accessor: 'activity',
        },
        {
          Header: labels?.subject || '',
          accessor: 'subject',
        },
        {
          Header: labels?.deadline || '',
          accessor: 'parsedDates.deadline',
        },
        !archived && {
          Header: labels?.status || '',
          accessor: 'status',
        },
        {
          Header: labels?.students || '',
          accessor: 'students',
        },
        {
          Header: labels?.completions || '',
          accessor: 'completion',
        },
        {
          Header: labels?.evaluated || '',
          accessor: 'evaluated',
          cellStyle: {
            justifyContent: 'center',
          },
        },
        !archived && {
          Header: (
            <Stack justifyContent="center" fullWidth>
              <PluginComunicaIcon />
            </Stack>
          ),
          accessor: 'messages',
          cellStyle: {
            justifyContent: 'center',
          },
        },
      ].filter(Boolean),
    [labels]
  );

  const studentColumns = useMemo(
    () =>
      [
        {
          Header: labels?.activity || '',
          accessor: 'activity',
        },
        {
          Header: labels?.subject || '',
          accessor: 'subject',
        },
        {
          Header: labels?.deadline || '',
          accessor: 'parsedDates.deadline',
        },
        !archived && {
          Header: labels?.status || '',
          accessor: 'status',
        },
        {
          Header: labels?.progress || '',
          accessor: 'progress',
        },
        !archived && {
          Header: labels?.messages || '',
          accessor: 'messages',
        },
      ].filter(Boolean),
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

export function useOngoingQuery(filters) {
  const sessionConfig = getSessionConfig();
  const isStudent = useIsStudent();

  return useMemo(() => {
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

    if (isStudent) {
      q.studentCanSee = true;
    }

    return q;
  }, [filters, sessionConfig?.program, isStudent]);
}

function useOngoingLocalizations() {
  const [, translations] = useTranslateLoader([
    prefixPN('pagination'),
    prefixPN('activities_list'),
  ]);

  return useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      return {
        pagination: _.get(res, prefixPN('pagination')),
        activitiesList: _.get(res, prefixPN('activities_list')),
      };
    }

    return {};
  }, [translations]);
}

export function useOngoingData({ query, page, size, subjectFullLength }) {
  const [modulesOpened, setModulesOpened] = useState([]);

  const { data: paginatedInstances, isLoading: instancesLoading } = useSearchOngoingActivities({
    ...query,
    offset: (page - 1) * size,
    limit: size,
    modulesData: true,
  });

  const instances = useMemo(
    () =>
      (paginatedInstances?.items ?? []).flatMap((instance) => [
        instance,
        ...(paginatedInstances?.modulesData?.[instance]?.activitiesIds || []),
      ]),
    [paginatedInstances]
  );

  const originalOrder = useMemo(() => {
    const order = {};

    instances?.forEach((instance, i) => {
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

    instancesData?.forEach((instance) => {
      sortedData[originalOrder[instance.instance?.id || instance.id]] = instance;
    });

    return sortedData;
  }, [originalOrder, instancesData]);

  const { data: parsedInstances, isLoading: parsedInstancesLoading } = useParseAssignations(
    orderedInstancesData,
    {
      subjectFullLength,
      modulesOpened,
      onModuleClick: (moduleId) => {
        setModulesOpened((opened) => {
          if (opened.includes(moduleId)) {
            return opened.filter((id) => id !== moduleId);
          }
          return [...opened, moduleId];
        });
      },
    }
  );

  const parsedInstancesWithoutCollapsedModules = useMemo(
    () =>
      parsedInstances
        ?.filter(
          (instance) =>
            !!instance && (!instance.parentModule || modulesOpened.includes(instance.parentModule))
        )
        .map((instance) => ({
          ...instance,
          modulesCollapsed: false,
        })),
    [parsedInstances, modulesOpened]
  );

  const isLoading = instancesLoading || instancesDataLoading || parsedInstancesLoading;

  return {
    parsedInstances: parsedInstancesWithoutCollapsedModules,
    isLoading,
    totalCount: paginatedInstances?.totalCount ?? 0,
    totalPages: Math.ceil((paginatedInstances?.totalCount ?? 0) / size),
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

  const columns = useAssignmentsColumns({ archived: !!filters?.isArchived });

  if (isLoading) {
    return <Loader />;
  }
  if (!parsedInstances?.length) {
    return (
      <Box
        sx={(theme) => ({
          width: '100%',
          height: 200, // 328,
          borderRadius: theme.spacing[1],
          // backgroundColor: theme.colors.uiBackground02,
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
        hidePaper
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
        onStyleRow={({ row }) => row?.original?.trStyle ?? null}
        labels={labels.pagination}
        headerStyles={headerStyles}
      />
    </>
  );
}

ActivitiesList.propTypes = {
  query: PropTypes.object,
};
