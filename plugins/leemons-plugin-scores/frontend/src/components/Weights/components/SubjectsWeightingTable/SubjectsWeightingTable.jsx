import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { LoadingOverlay, Table } from '@bubbles-ui/components';
import { useHistory } from 'react-router-dom';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import { useSearchParams } from '@common';
import { WeightConfigDrawer } from '../WeightConfigDrawer';
import usePreparedData from './hooks/usePreparedData';
import RulesRenderer from './components/RulesRenderer';
import useUpdateEditingClass from './hooks/useUpdateEditingClass';

export default function SubjectsWeightingTable({ program, filters: { subject, course } = {} }) {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('weighting.table'));

  const queryParams = useSearchParams();
  const history = useHistory();

  const [editingClass, setEditingClass] = useState();
  const { data: sessionClasses, isLoading: isLoadingPreparedData } = usePreparedData({
    program,
    subject,
    course,
    onEdit: (klass) => {
      setEditingClass(klass);

      const newParams = new URLSearchParams(queryParams);
      newParams.set('class', klass.id);
      history.replace({ search: newParams.toString() });
    },
  });

  const isLoading = isLoadingPreparedData || tLoading || !program;

  useUpdateEditingClass({ isLoading, sessionClasses, editingClass, setEditingClass });

  const columns = useMemo(
    () => [
      {
        Header: t('headers.subject'),
        accessor: 'subject',
      },
      {
        Header: t('headers.group'),
        accessor: 'group',
      },
      {
        Header: t('headers.course'),
        accessor: 'course',
      },
      {
        Header: t('headers.rules'),
        accessor: 'rules',
        Cell: RulesRenderer,
      },
      {
        Header: t('headers.actions'),
        accessor: 'actions',
      },
    ],
    [t]
  );

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  return (
    <>
      <Table data={sessionClasses} columns={columns} />
      <WeightConfigDrawer
        class={editingClass}
        onClose={() => {
          setEditingClass(null);

          const newParams = new URLSearchParams(queryParams);
          newParams.delete('class');
          history.replace({ search: newParams.toString() });
        }}
      />
    </>
  );
}

SubjectsWeightingTable.propTypes = {
  program: PropTypes.string.isRequired,
  filters: PropTypes.shape({
    subject: PropTypes.string,
    course: PropTypes.string,
  }),
};
