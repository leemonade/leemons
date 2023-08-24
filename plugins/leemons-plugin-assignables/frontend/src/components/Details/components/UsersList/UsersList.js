import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { ContextContainer, SearchInput, Stack, Title } from '@bubbles-ui/components';
import _ from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useParsedStudents from './helpers/useParseStudents';
import StudentsList from './StudentsList';
import prefixPN from '../../../../helpers/prefixPN';

export default function UserList({ instance }) {
  const [, translations] = useTranslateLoader([
    prefixPN('studentsList'),
    prefixPN('activity_status'),
    prefixPN('pagination'),
  ]);

  const { labels, placeholders, descriptions, status } = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = _.get(res, prefixPN('studentsList'));

      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return {
        ...data,
        status: _.get(res, prefixPN('activity_status')),
        pagination: _.get(res, prefixPN('pagination')),
      };
    }

    return {
      labels: {},
      placeholders: {},
      descriptions: {},
      status: {},
    };
  }, [translations]);

  const students = useParsedStudents(instance, status);
  const [query, setQuery] = useState('');

  const filteredStudents = useMemo(() => {
    const normalize = (str) =>
      str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    if (!query?.length) {
      return students;
    }

    const normalizedQuery = normalize(query);

    return students.filter(
      ({ userInfo }) =>
        normalize(userInfo?.name)?.includes(normalizedQuery) ||
        normalize(userInfo?.surnames)?.includes(normalizedQuery)
    );
  }, [students, query]);

  return (
    <>
      <ContextContainer spacing={5} sx={(theme) => ({ padding: theme.spacing[5] })}>
        <Stack fullWidth>
          <Title order={4}>
            {labels?.students} {students.length}
          </Title>
          <SearchInput
            placeholder={placeholders?.searchStudent}
            variant="filled"
            value={query}
            onChange={setQuery}
          />
        </Stack>
        {/* <Stack justifyContent="space-between" alignItems="center" fullWidth>
          <Select
            orientation="horizontal"
            description={`${descriptions?.searchStudent} ${selected.length}`}
            data={bulkActions}
            label={labels?.bulkActions?.label}
            placeholder={placeholders?.bulkActions}
          />
          <Button>{labels?.assignStudent}</Button>
        </Stack> */}
        <StudentsList instance={instance} labels={labels} students={filteredStudents} />
      </ContextContainer>
    </>
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
