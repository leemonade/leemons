import React, { useEffect, useMemo, useState } from 'react';

import { ContextContainer, Stack, Checkbox, Text } from '@bubbles-ui/components';
import { SearchIcon } from '@bubbles-ui/icons/outline';
import { TagsAutocomplete } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import StudentsTable from '../SubjectView/StudentsTable';

import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { getStudentsByTagsRequest } from '@academic-portfolio/request';

const StudentsSelectByTags = ({
  centerId,
  previouslyEnrolledStudents,
  setSelectedStudents,
  localizations,
}) => {
  const [tags, setTags] = useState();
  const [studentsFound, setStudentsFound] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [t] = useTranslateLoader(prefixPN('tree_page.enrrollmentDrawer'));

  const checkBoxColumn = useMemo(
    () => ({
      Header: (
        <Checkbox
          checked={selectAll}
          onChange={(value) => {
            setStudentsFound(
              studentsFound.map((student) => ({
                ...student,
                checked: { ...student.checked, checked: value },
              }))
            );
            setSelectAll(value);
          }}
        />
      ),
      accessor: 'checked',
      valueRender: (checkedValue) => (
        <Checkbox
          checked={checkedValue.checked}
          onChange={(val) => {
            const updatedStudents = studentsFound.map((student) => {
              if (student.userAgent === checkedValue.userAgent) {
                return { ...student, checked: { ...student.checked, checked: val } };
              }
              return student;
            });
            setStudentsFound(updatedStudents);
          }}
        />
      ),
    }),
    [selectAll, studentsFound]
  );

  const onTagsChange = async (tagsValue) => {
    setTags(tagsValue);

    if (tagsValue.length === 0) {
      setStudentsFound([]);
      return;
    }

    const response = await getStudentsByTagsRequest(tagsValue, centerId);

    if (response.students?.length) {
      const filteredStudents = previouslyEnrolledStudents?.length
        ? response.students.filter(
            (student) =>
              !previouslyEnrolledStudents
                .map((prevStudent) => prevStudent.value)
                .includes(student.id)
          )
        : response.students;

      setStudentsFound([
        ...filteredStudents.map((student) => ({
          ...student.user,
          userAgent: student.id,
          checked: { userAgent: student.id, checked: false },
        })),
      ]);
    } else {
      setStudentsFound([]);
    }
  };

  useEffect(() => {
    if (studentsFound?.length) {
      const checkedUsers = studentsFound
        .filter((student) => student.checked.checked)
        .map(({ userAgent, ...others }) => ({ ...others, value: userAgent }));
      setSelectedStudents(checkedUsers);
    }
  }, [studentsFound]);

  const TableEmptyStates = useMemo(() => {
    if (!tags?.length && !studentsFound?.length) {
      return <Text strong>{t('noTagsSelected')}</Text>;
    } else if (tags?.length && !studentsFound?.length) {
      if (tags?.length === 1) {
        return <Text strong>{t('noStudentsFoundSingular')}</Text>;
      }
      return <Text strong>{t('noStudentsFoundPlural')}</Text>;
    }
    return null;
  }, [tags, studentsFound, localizations]);

  return (
    <Stack direction="column">
      <ContextContainer sx={{ padding: '24px' }}>
        <TagsAutocomplete
          onChange={onTagsChange}
          pluginName="users"
          value={tags}
          labels={{ addButton: localizations?.search }}
          ButtonLeftIcon={<SearchIcon width={24} height={24} />}
        />
        {!studentsFound?.length ? (
          <Stack alignItems="center" justifyContent="center" fullWidth mt={tags?.length ? 34 : 72}>
            {TableEmptyStates}
          </Stack>
        ) : (
          <StudentsTable data={studentsFound} checkBoxColumn={checkBoxColumn} />
        )}
      </ContextContainer>
    </Stack>
  );
};

StudentsSelectByTags.propTypes = {
  centerId: PropTypes.string.isRequired,
  previouslyEnrolledStudents: PropTypes.array,
  setSelectedStudents: PropTypes.func.isRequired,
  localizations: PropTypes.object,
};

export default StudentsSelectByTags;
