import React, { useMemo, useState } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Table, Avatar, Stack, SearchInput, Loader } from '@bubbles-ui/components';

import { LocaleDate } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';

import prefixPN from '@academic-portfolio/helpers/prefixPN';

function useFilters() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');

  return [
    { query, status },
    (field, value) => {
      if (field === 'query') {
        setQuery(value);
      }
      if (field === 'status') {
        setStatus(value);
      }
    },
  ];
}

function useFilteredStudents({ students = [], filters }) {
  const normalize = (str) =>
    str
      ?.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const normalizedQuery = useMemo(() => normalize(filters?.query), [filters?.query]);

  return useMemo(
    () =>
      students.filter(
        ({ name, surnames, email }) =>
          normalize(name)?.includes(normalizedQuery) ||
          normalize(surnames)?.includes(normalizedQuery) ||
          normalize(email)?.includes(normalizedQuery)
      ) ?? [],
    [students, normalizedQuery]
  );
}

// Data should contain actions ;)
const StudentsTable = ({ data, showSearchBar, checkBoxColumn, isLoading }) => {
  const [t] = useTranslateLoader(prefixPN('tree_page.studentsTable'));
  const [filters, onFilterChange] = useFilters();
  const filteredStudents = useFilteredStudents({ students: data, filters });

  const tableColumns = useMemo(() => {
    let columns = [
      {
        Header: ' ',
        accessor: 'avatar',
        valueRender: (avatar) => <Avatar image={avatar} />,
      },
      {
        Header: t('surnames'),
        accessor: 'surnames',
      },
      {
        Header: t('name'),
        accessor: 'name',
      },
      {
        Header: t('email'),
        accessor: 'email',
      },
      {
        Header: t('birthdate'),
        accessor: 'birthdate',

        valueRender: (birthdate) => <LocaleDate date={birthdate} />,
      },
      {
        Header: ' ',
        accessor: 'actions',
      },
    ];
    if (!isEmpty(checkBoxColumn)) {
      columns = [checkBoxColumn, ...columns];
    }
    return columns;
  }, [checkBoxColumn, t]);

  if (isLoading) return <Loader />;
  return (
    <Stack direction="column" spacing={4}>
      {showSearchBar && (
        <SearchInput
          placeholder={t('searchBarPlaceholder')}
          value={filters?.query}
          onChange={(value) => onFilterChange('query', value)}
        />
      )}
      <Table columns={tableColumns} data={filteredStudents} />
    </Stack>
  );
};

export default StudentsTable;

StudentsTable.propTypes = {
  data: PropTypes.array.isRequired,
  showSearchBar: PropTypes.bool,
  checkBoxColumn: PropTypes.object,
  isLoading: PropTypes.bool,
};
