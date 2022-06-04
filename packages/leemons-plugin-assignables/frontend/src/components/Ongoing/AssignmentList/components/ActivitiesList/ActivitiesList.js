import React, { useState, useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import { PaginatedList } from '@bubbles-ui/components';
import _ from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useSearchAssignableInstances from '../../../../../hooks/assignableInstance/useSearchAssignableInstances';
import useParseAssignations from '../../hooks/useParseAssignations';
import useAssignationsByProfile from '../../hooks/useAssignationsByProfile';
import globalContext from '../../../../../contexts/globalContext';
import prefixPN from '../../../../../helpers/prefixPN';

function useAssignmentsColumns() {
  const { isTeacher } = useContext(globalContext);

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

  const commonColumns = useMemo(
    () => [
      {
        Header: labels?.task || '',
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
    ],
    [labels]
  );

  const columns = useMemo(() => {
    if (isTeacher) {
      return [
        ...commonColumns,
        {
          Header: labels.students || '',
          accessor: 'students',
        },
        {
          Header: labels.open || '',
          accessor: 'open',
        },
        {
          Header: labels.ongoing || '',
          accessor: 'ongoing',
        },
        {
          Header: labels.completed || '',
          accessor: 'completed',
        },
        {
          Header: '',
          accessor: 'actions',
        },
      ];
    }

    return [
      ...commonColumns,
      {
        Header: labels.status || '',
        accessor: 'status',
      },
      {
        Header: labels.submission || '',
        accessor: 'submission',
      },
      {
        Header: '',
        accessor: 'actions',
      },
    ];
  }, [isTeacher, labels]);

  return columns;
}

export default function ActivitiesList({ filters, subjectFullLength = true }) {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const query = useMemo(() => {
    const q = {};

    if (filters?.query) {
      q.search = filters?.query;
    }

    if (filters?.subject && filters?.subject !== 'all') {
      q.subjects = JSON.stringify([filters?.subject]);
    }

    if (filters?.class && filters?.class !== 'all') {
      q.classes = JSON.stringify([filters?.class]);
    }

    if (filters?.type && filters?.type !== 'all') {
      q.role = filters?.type;
    }
    if (filters?.status && filters?.status !== 'all') {
      q.status = filters?.status;
    }

    if (filters?.tab === 'ongoing') {
      q.closed = false;
      q.evaluated = false;
    } else if (filters?.tab === 'history') {
      q.closed = true;
    } else if (filters?.tab === 'evaluated') {
      q.evaluated = true;
    }

    return q;
  }, [filters]);

  const [instances, instancesLoading] = useSearchAssignableInstances(query);

  const instancesInPage = useMemo(() => {
    if (!instances.length) {
      return [];
    }

    return instances.slice((page - 1) * size, page * size);
  }, [instances, page, size]);

  const [instancesData, instancesDataLoading] = useAssignationsByProfile(instancesInPage);
  const [parsedInstances, parsedInstancesLoading] = useParseAssignations(instancesData, {
    subjectFullLength,
  });
  const columns = useAssignmentsColumns();

  const isLoading = instancesLoading || instancesDataLoading || parsedInstancesLoading;

  return (
    <>
      <PaginatedList
        columns={columns}
        items={parsedInstances}
        page={page}
        size={size}
        loading={isLoading}
        totalCount={instances.length}
        totalPages={Math.ceil(instances.length / size)}
        onSizeChange={setSize}
        onPageChange={setPage}
        selectable={false}
      />
    </>
  );
}

ActivitiesList.propTypes = {
  query: PropTypes.object,
};
