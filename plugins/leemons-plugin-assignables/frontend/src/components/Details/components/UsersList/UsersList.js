import { useMemo, useState } from 'react';

import { SearchInput, Box, Text } from '@bubbles-ui/components';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import _ from 'lodash';
import PropTypes from 'prop-types';

import prefixPN from '../../../../helpers/prefixPN';

import StudentsList from './StudentsList';
import useUserListStyles from './UsersList.styles';
import useParsedStudents from './helpers/useParseStudents';

function useUserListLocalizations() {
  const [, translations] = useTranslateLoader([
    prefixPN('studentsList'),
    prefixPN('activity_status'),
    prefixPN('activities_filters.seeAll'),
  ]);

  const { labels, placeholders, descriptions, status, seeAll } = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = _.get(res, prefixPN('studentsList'));
      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return {
        ...data,
        status: _.get(res, prefixPN('activity_status')),
        seeAll: _.get(res, prefixPN('activities_filters.seeAll')),
      };
    }
    return {
      labels: {},
      placeholders: {},
      descriptions: {},
      status: {},
      seeAll: '',
    };
  }, [translations]);

  return {
    labels,
    placeholders,
    descriptions,
    status,
    seeAll,
  };
}

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
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f,]/g, '')
      .trim();

  const normalizedQuery = useMemo(() => normalize(filters?.query), [filters?.query]);

  return useMemo(
    () =>
      students.filter(
        ({ userInfo }) =>
          normalize(`${userInfo?.name} ${userInfo?.surnames}`)?.includes(normalizedQuery) ||
          normalize(`${userInfo?.surnames} ${userInfo?.name}`)?.includes(normalizedQuery)
      ) ?? [],
    [students, normalizedQuery]
  );
}

export default function UserList({ instance }) {
  const { classes } = useUserListStyles();
  const localizations = useUserListLocalizations();

  const [filters, onFilterChange] = useFilters();
  const parsedStudents = useParsedStudents(instance, localizations?.status);
  const students = useFilteredStudents({ students: parsedStudents, filters });

  // const progressData = useProgress(localizations);

  return (
    <Box className={classes.root}>
      <Text className={classes.title} color="primary">
        {localizations?.labels?.students}
      </Text>
      <Box className={classes.filters}>
        <SearchInput
          placeholder={localizations?.placeholders?.searchStudent}
          value={filters?.query}
          onChange={(value) => onFilterChange('query', value)}
        />
        {/* <Select
          data={progressData}
          placeholder={localizations?.placeholders?.status}
          value={filters?.status}
          onChange={(value) => onFilterChange('status', value)}
        /> */}
      </Box>
      <StudentsList instance={instance} labels={localizations?.labels} students={students} />
    </Box>
  );
}

UserList.propTypes = {
  instance: PropTypes.object,
  labels: PropTypes.shape({
    students: PropTypes.string,
    assignStudent: PropTypes.string,
    studentListcolumns: PropTypes.shape({
      student: PropTypes.string,
      status: PropTypes.string,
      completed: PropTypes.string,
      avgTime: PropTypes.string,
      score: PropTypes.string,
      unreadMessages: PropTypes.string,
    }),
    bulkActions: PropTypes.shape({
      label: PropTypes.string,
      SEND_REMINDER: PropTypes.string,
    }),
  }),
  placeholders: PropTypes.shape({
    bulkActions: PropTypes.string,
    searchStudent: PropTypes.string,
  }),
  descriptions: PropTypes.shape({
    searchStudent: PropTypes.string,
  }),
};
