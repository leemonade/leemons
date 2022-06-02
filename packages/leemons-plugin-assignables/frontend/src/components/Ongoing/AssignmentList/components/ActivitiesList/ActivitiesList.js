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
        Header: labels.timeReference || '',
        accessor: 'timeReference',
      },
      {
        Header: '',
        accessor: 'actions',
      },
    ];
  }, [isTeacher, labels]);

  return columns;
}

export default function ActivitiesList({ closed = false }) {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const query = useMemo(() => {
    const q = {};

    if (closed) {
      q.close_max = new Date();
      q.close = new Date();
      q.close_default = false;
    } else {
      q.close_min = new Date();
      q.close_default = true;
    }

    return q;
  }, []);

  const [instances, instancesLoading] = useSearchAssignableInstances(query);

  const instancesInPage = useMemo(() => {
    if (!instances.length) {
      return [];
    }

    return instances.slice((page - 1) * size, page * size);
  }, [instances, page, size]);

  const [instancesData, instancesDataLoading] = useAssignationsByProfile(instancesInPage);
  const [parsedInstances, parsedInstancesLoading] = useParseAssignations(instancesData);
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
  closed: PropTypes.bool,
};
